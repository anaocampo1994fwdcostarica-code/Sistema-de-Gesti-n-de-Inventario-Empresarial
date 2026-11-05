const { AjusteInventario, MovimientoInventario, Producto, Ubicacion, Usuario } = require('../models');
const { aplicarAjuste } = require('../services/ajusteService');
const { ApiError, assertBody, assertPositiveInteger, assertRequired } = require('../middlewares/validation');
const include = [
  { model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] },
  { model: Ubicacion, as: 'ubicacion', attributes: ['id', 'codigo', 'nombre'] },
  { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
  { model: MovimientoInventario, as: 'movimientoInventario' },
];
exports.create = async (req, res, next) => { try { assertBody(req.body, ['productoId', 'ubicacionId', 'cantidadNueva', 'motivo', 'claveIdempotencia']); assertRequired(req.body, ['productoId', 'ubicacionId', 'cantidadNueva', 'motivo', 'claveIdempotencia']); const result = await aplicarAjuste({ productoId: assertPositiveInteger(req.body.productoId, 'productoId'), ubicacionId: assertPositiveInteger(req.body.ubicacionId, 'ubicacionId'), cantidadNueva: req.body.cantidadNueva, motivo: req.body.motivo, claveIdempotencia: req.body.claveIdempotencia, usuarioId: req.user.id }); return res.status(result.repeated ? 200 : 201).json({ repetida: result.repeated, ajuste: await AjusteInventario.findByPk(result.ajuste.id, { include }) }); } catch (e) { return next(e); } };
exports.findAll = async (_req, res, next) => { try { return res.status(200).json(await AjusteInventario.findAll({ include, order: [['id', 'ASC']] })); } catch (e) { return next(e); } };
exports.findById = async (req, res, next) => { try { const item = await AjusteInventario.findByPk(req.resourceId, { include }); if (!item) throw new ApiError(404, 'Ajuste no encontrado.'); return res.status(200).json(item); } catch (e) { return next(e); } };
const immutable = (_req, _res, next) => next(new ApiError(409, 'Los ajustes aplicados son inmutables.'));
exports.update = immutable;
exports.remove = immutable;
