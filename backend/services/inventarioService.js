const { Transaction } = require('sequelize');
const {
  Existencia,
  MovimientoInventario,
  Producto,
  TipoMovimiento,
  Ubicacion,
  sequelize,
} = require('../models');
const { ApiError } = require('../middlewares/validation');

const getLockedExistence = async (productoId, ubicacionId, transaction, createIfMissing = false) => {
  let existencia = await Existencia.findOne({
    where: { productoId, ubicacionId },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  if (!existencia && createIfMissing) {
    existencia = await Existencia.create({ productoId, ubicacionId, cantidad: 0 }, { transaction });
  }
  return existencia;
};

const saveQuantity = async (existencia, cantidad, transaction) => {
  existencia.cantidad = cantidad;
  await existencia.save({ transaction });
};

const executeMovimiento = async ({
  productoId,
  tipoMovimientoId,
  ubicacionOrigenId,
  ubicacionDestinoId,
  cantidad,
  motivo,
  referencia,
  usuarioId,
}, transaction) => {
    if (!Number.isSafeInteger(cantidad) || cantidad <= 0) {
      throw new ApiError(400, 'cantidad debe ser un entero mayor que cero.');
    }

    const producto = await Producto.findByPk(productoId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!producto) throw new ApiError(404, 'Producto no encontrado.');

    const tipo = await TipoMovimiento.findOne({
      where: { id: tipoMovimientoId, activo: true },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!tipo) throw new ApiError(400, 'El tipo de movimiento no existe o está inactivo.');

    if (tipo.efecto === 'ENTRADA' && (!ubicacionDestinoId || ubicacionOrigenId)) {
      throw new ApiError(400, 'Una entrada requiere únicamente una ubicación destino.');
    }
    if (tipo.efecto === 'SALIDA' && (!ubicacionOrigenId || ubicacionDestinoId)) {
      throw new ApiError(400, 'Una salida requiere únicamente una ubicación origen.');
    }
    if (tipo.efecto === 'TRASLADO' && (!ubicacionOrigenId || !ubicacionDestinoId || ubicacionOrigenId === ubicacionDestinoId)) {
      throw new ApiError(400, 'Un traslado requiere ubicaciones de origen y destino diferentes.');
    }

    const locationIds = [...new Set([ubicacionOrigenId, ubicacionDestinoId].filter(Boolean))].sort((a, b) => a - b);
    const ubicaciones = await Ubicacion.findAll({
      where: { id: locationIds, activo: true },
      order: [['id', 'ASC']],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (ubicaciones.length !== locationIds.length) {
      throw new ApiError(400, 'Una ubicación no existe o está inactiva.');
    }

    if (tipo.efecto === 'ENTRADA') {
      const destino = await getLockedExistence(productoId, ubicacionDestinoId, transaction, true);
      await saveQuantity(destino, Number(destino.cantidad) + cantidad, transaction);
    } else if (tipo.efecto === 'SALIDA') {
      const origen = await getLockedExistence(productoId, ubicacionOrigenId, transaction);
      if (!origen || Number(origen.cantidad) < cantidad) throw new ApiError(409, 'Inventario insuficiente.');
      await saveQuantity(origen, Number(origen.cantidad) - cantidad, transaction);
    } else {
      const origen = await getLockedExistence(productoId, ubicacionOrigenId, transaction);
      if (!origen || Number(origen.cantidad) < cantidad) throw new ApiError(409, 'Inventario insuficiente.');
      const destino = await getLockedExistence(productoId, ubicacionDestinoId, transaction, true);
      await saveQuantity(origen, Number(origen.cantidad) - cantidad, transaction);
      await saveQuantity(destino, Number(destino.cantidad) + cantidad, transaction);
    }

    const total = Number(await Existencia.sum('cantidad', { where: { productoId }, transaction })) || 0;
    await producto.update({ cantidad: total }, { transaction });

    return MovimientoInventario.create({
      productoId,
      tipoMovimientoId,
      ubicacionOrigenId: ubicacionOrigenId || null,
      ubicacionDestinoId: ubicacionDestinoId || null,
      cantidad,
      motivo: motivo || null,
      referencia: referencia || null,
      usuarioId,
      fechaMovimiento: new Date(),
    }, { transaction });
};

const registrarMovimiento = async (data, { transaction } = {}) => {
  if (transaction) return executeMovimiento(data, transaction);
  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
    (managedTransaction) => executeMovimiento(data, managedTransaction),
  );
};

module.exports = { registrarMovimiento };
