const { Transaction } = require('sequelize');
const {
  Compra, DetalleCompra, Venta, DetalleVenta, TipoMovimiento, sequelize,
} = require('../models');
const { ApiError } = require('../middlewares/validation');
const { registrarMovimiento } = require('./inventarioService');
const { fromCents, toCents } = require('./money');

const definitions = {
  compra: { Model: Compra, Detail: DetalleCompra, foreignKey: 'compraId', typeCode: 'COMPRA', effect: 'ENTRADA', locationField: 'ubicacionDestinoId' },
  venta: { Model: Venta, Detail: DetalleVenta, foreignKey: 'ventaId', typeCode: 'VENTA', effect: 'SALIDA', locationField: 'ubicacionOrigenId' },
};

const recalculateTotal = async (kind, id, transaction) => {
  const def = definitions[kind];
  const details = await def.Detail.findAll({ where: { [def.foreignKey]: id }, transaction });
  const cents = details.reduce((sum, detail) => sum + toCents(detail.subtotal, 'subtotal'), 0);
  await def.Model.update({ total: fromCents(cents) }, { where: { id }, transaction });
  return fromCents(cents);
};

const confirmDocument = async (kind, id, key, usuarioId) => {
  const def = definitions[kind];
  if (typeof key !== 'string' || !key.trim() || key.trim().length > 100) throw new ApiError(400, 'claveIdempotencia es obligatoria y no puede superar 100 caracteres.');
  return sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED }, async (transaction) => {
    const document = await def.Model.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!document) throw new ApiError(404, `${kind === 'compra' ? 'Compra' : 'Venta'} no encontrada.`);
    if (document.estado === 'CONFIRMADA') {
      if (document.claveIdempotencia === key.trim()) return { document, repeated: true };
      throw new ApiError(409, 'El documento ya fue confirmado.');
    }
    if (document.estado !== 'BORRADOR') throw new ApiError(409, 'Solo se pueden confirmar documentos en borrador.');
    const details = await def.Detail.findAll({ where: { [def.foreignKey]: id }, order: [['productoId', 'ASC'], ['ubicacionId', 'ASC'], ['id', 'ASC']], transaction, lock: transaction.LOCK.UPDATE });
    if (!details.length) throw new ApiError(400, 'El documento debe contener al menos un detalle.');
    const type = await TipoMovimiento.findOne({ where: { codigo: def.typeCode, efecto: def.effect, activo: true }, transaction });
    if (!type) throw new ApiError(409, `Debe existir un tipo de movimiento activo con código ${def.typeCode}.`);
    const total = await recalculateTotal(kind, id, transaction);
    for (const detail of details) {
      await registrarMovimiento({
        productoId: detail.productoId,
        tipoMovimientoId: type.id,
        [def.locationField]: detail.ubicacionId,
        cantidad: detail.cantidad,
        motivo: `${kind === 'compra' ? 'Compra' : 'Venta'} #${id}`,
        referencia: `${kind.toUpperCase()}-${id}-${detail.id}`,
        usuarioId,
      }, { transaction });
    }
    await document.update({ estado: 'CONFIRMADA', total, claveIdempotencia: key.trim() }, { transaction });
    return { document, repeated: false };
  });
};

module.exports = { confirmDocument, recalculateTotal };
