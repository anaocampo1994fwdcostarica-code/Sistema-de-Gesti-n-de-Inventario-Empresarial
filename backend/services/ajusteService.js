const { Transaction } = require('sequelize');
const { AjusteInventario, Existencia, Producto, TipoMovimiento, Ubicacion, sequelize } = require('../models');
const { ApiError } = require('../middlewares/validation');
const { registrarMovimiento } = require('./inventarioService');

const aplicarAjuste = async ({ productoId, ubicacionId, cantidadNueva, motivo, claveIdempotencia, usuarioId }) => {
  if (!Number.isSafeInteger(cantidadNueva) || cantidadNueva < 0) throw new ApiError(400, 'cantidadNueva debe ser un entero no negativo.');
  if (typeof motivo !== 'string' || !motivo.trim() || motivo.trim().length > 255) throw new ApiError(400, 'motivo es obligatorio y no puede superar 255 caracteres.');
  if (typeof claveIdempotencia !== 'string' || !claveIdempotencia.trim() || claveIdempotencia.trim().length > 100) throw new ApiError(400, 'claveIdempotencia es obligatoria y no puede superar 100 caracteres.');
  return sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED }, async (transaction) => {
    const existing = await AjusteInventario.findOne({ where: { claveIdempotencia: claveIdempotencia.trim() }, transaction, lock: transaction.LOCK.UPDATE });
    if (existing) return { ajuste: existing, repeated: true };
    const product = await Producto.findByPk(productoId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!product) throw new ApiError(404, 'Producto no encontrado.');
    const location = await Ubicacion.findOne({ where: { id: ubicacionId, activo: true }, transaction, lock: transaction.LOCK.UPDATE });
    if (!location) throw new ApiError(400, 'La ubicación no existe o está inactiva.');
    let existence = await Existencia.findOne({ where: { productoId, ubicacionId }, transaction, lock: transaction.LOCK.UPDATE });
    const previous = existence ? Number(existence.cantidad) : 0;
    const difference = cantidadNueva - previous;
    if (difference === 0) throw new ApiError(400, 'La cantidad nueva debe ser diferente de la cantidad actual.');
    const code = difference > 0 ? 'AJUSTE_ENTRADA' : 'AJUSTE_SALIDA';
    const effect = difference > 0 ? 'ENTRADA' : 'SALIDA';
    const type = await TipoMovimiento.findOne({ where: { codigo: code, efecto: effect, activo: true }, transaction, lock: transaction.LOCK.UPDATE });
    if (!type) throw new ApiError(409, `Debe existir un tipo de movimiento activo con código ${code}.`);
    const movement = await registrarMovimiento({
      productoId, tipoMovimientoId: type.id,
      [difference > 0 ? 'ubicacionDestinoId' : 'ubicacionOrigenId']: ubicacionId,
      cantidad: Math.abs(difference), motivo: motivo.trim(), referencia: `AJUSTE-${claveIdempotencia.trim()}`, usuarioId,
    }, { transaction });
    existence = await Existencia.findOne({ where: { productoId, ubicacionId }, transaction });
    if (!existence || Number(existence.cantidad) !== cantidadNueva) throw new ApiError(500, 'No fue posible aplicar el ajuste de forma consistente.');
    const ajuste = await AjusteInventario.create({
      productoId, ubicacionId, usuarioId, cantidadAnterior: previous, cantidadNueva,
      diferencia: difference, motivo: motivo.trim(), movimientoInventarioId: movement.id,
      claveIdempotencia: claveIdempotencia.trim(), fecha: new Date(),
    }, { transaction });
    return { ajuste, repeated: false };
  });
};
module.exports = { aplicarAjuste };
