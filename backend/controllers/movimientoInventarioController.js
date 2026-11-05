const {
  Bodega,
  MovimientoInventario,
  Producto,
  TipoMovimiento,
  Ubicacion,
  Usuario,
} = require('../models');
const { registrarMovimiento } = require('../services/inventarioService');
const {
  ApiError,
  assertBody,
  assertPositiveInteger,
  assertRequired,
  normalizeOptionalString,
} = require('../middlewares/validation');

const fields = ['productoId', 'tipoMovimientoId', 'ubicacionOrigenId', 'ubicacionDestinoId', 'cantidad', 'motivo', 'referencia'];
const locationInclude = (as) => ({
  model: Ubicacion,
  as,
  attributes: ['id', 'codigo', 'nombre', 'bodegaId'],
  include: [{ model: Bodega, as: 'bodega', attributes: ['id', 'nombre'] }],
});
const includeRelations = [
  { model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] },
  { model: TipoMovimiento, as: 'tipoMovimiento', attributes: ['id', 'codigo', 'nombre', 'efecto'] },
  locationInclude('ubicacionOrigen'),
  locationInclude('ubicacionDestino'),
  { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
];

const optionalId = (value, field) => {
  if (value === undefined || value === null) return null;
  return assertPositiveInteger(value, field);
};

exports.create = async (req, res, next) => {
  try {
    assertBody(req.body, fields);
    assertRequired(req.body, ['productoId', 'tipoMovimientoId', 'cantidad']);
    const movimiento = await registrarMovimiento({
      productoId: assertPositiveInteger(req.body.productoId, 'productoId'),
      tipoMovimientoId: assertPositiveInteger(req.body.tipoMovimientoId, 'tipoMovimientoId'),
      ubicacionOrigenId: optionalId(req.body.ubicacionOrigenId, 'ubicacionOrigenId'),
      ubicacionDestinoId: optionalId(req.body.ubicacionDestinoId, 'ubicacionDestinoId'),
      cantidad: req.body.cantidad,
      motivo: normalizeOptionalString(req.body.motivo, 'motivo', 255),
      referencia: normalizeOptionalString(req.body.referencia, 'referencia', 100),
      usuarioId: req.user.id,
    });
    return res.status(201).json(await MovimientoInventario.findByPk(movimiento.id, { include: includeRelations }));
  } catch (error) { return next(error); }
};

exports.findAll = async (_req, res, next) => {
  try {
    return res.status(200).json(await MovimientoInventario.findAll({ include: includeRelations, order: [['id', 'ASC']] }));
  } catch (error) { return next(error); }
};

exports.findById = async (req, res, next) => {
  try {
    const movimiento = await MovimientoInventario.findByPk(req.resourceId, { include: includeRelations });
    if (!movimiento) throw new ApiError(404, 'Movimiento de inventario no encontrado.');
    return res.status(200).json(movimiento);
  } catch (error) { return next(error); }
};

const immutable = (_req, _res, next) => next(new ApiError(409, 'Los movimientos aplicados son inmutables; no se pueden editar ni eliminar.'));
exports.update = immutable;
exports.remove = immutable;
