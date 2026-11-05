const { Transaction } = require('sequelize');
const { Producto, TipoMovimiento, Ubicacion, sequelize } = require('../models');
const { ApiError } = require('../middlewares/validation');
const { registrarMovimiento } = require('./inventarioService');

const RESERVED_TYPES = new Set(['COMPRA', 'VENTA', 'AJUSTE_ENTRADA', 'AJUSTE_SALIDA']);

const createProductWithInitialStock = async ({ productData, initialQuantity, ubicacionId, tipoMovimientoId, usuarioId }, options = {}) => {
  const execute = async (transaction) => {
    let tipo;
    if (initialQuantity > 0) {
      const results = await Promise.all([
        TipoMovimiento.findOne({ where: { id: tipoMovimientoId, activo: true }, transaction, lock: transaction.LOCK.UPDATE }),
        Ubicacion.findOne({ where: { id: ubicacionId, activo: true }, transaction, lock: transaction.LOCK.UPDATE }),
      ]);
      [tipo] = results;
      const ubicacion = results[1];
      if (!tipo || tipo.efecto !== 'ENTRADA' || RESERVED_TYPES.has(tipo.codigo)) {
        throw new ApiError(400, 'Seleccione un tipo manual de entrada activo.');
      }
      if (!ubicacion) throw new ApiError(400, 'Seleccione una ubicación activa para el inventario inicial.');
    }

    const producto = await Producto.create({ ...productData, cantidad: 0 }, { transaction });
    if (initialQuantity > 0) {
      await registrarMovimiento({
        productoId: producto.id,
        tipoMovimientoId: tipo.id,
        ubicacionOrigenId: null,
        ubicacionDestinoId: ubicacionId,
        cantidad: initialQuantity,
        motivo: 'Inventario inicial del producto',
        referencia: `PRODUCTO-INICIAL-${producto.id}`,
        usuarioId,
      }, { transaction });
      await producto.reload({ transaction });
    }
    return producto;
  };

  if (options.transaction) return execute(options.transaction);
  return sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED }, execute);
};

module.exports = { createProductWithInitialStock };
