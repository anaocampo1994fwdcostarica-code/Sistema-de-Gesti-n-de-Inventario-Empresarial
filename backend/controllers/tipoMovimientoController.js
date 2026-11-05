const { Op } = require('sequelize');
const { TipoMovimiento } = require('../models');
const { ApiError, assertBody, assertRequired, normalizeRequiredString } = require('../middlewares/validation');

const fields = ['codigo', 'nombre', 'efecto', 'activo'];
const effects = ['ENTRADA', 'SALIDA', 'TRASLADO'];
const buildData = (body, update = false) => {
  assertBody(body, fields, { requireAtLeastOne: update });
  if (!update) assertRequired(body, ['codigo', 'nombre', 'efecto']);
  const data = {};
  if (body.codigo !== undefined) data.codigo = normalizeRequiredString(body.codigo, 'codigo', 30).toUpperCase();
  if (body.nombre !== undefined) data.nombre = normalizeRequiredString(body.nombre, 'nombre', 100);
  if (body.efecto !== undefined) { if (typeof body.efecto !== 'string' || !effects.includes(body.efecto.toUpperCase())) throw new ApiError(400, 'efecto debe ser ENTRADA, SALIDA o TRASLADO.'); data.efecto = body.efecto.toUpperCase(); }
  if (body.activo !== undefined) { if (typeof body.activo !== 'boolean') throw new ApiError(400, 'activo debe ser booleano.'); data.activo = body.activo; }
  return data;
};
const ensureUnique = async (data, excludedId) => {
  const conditions = [];
  if (data.codigo !== undefined) conditions.push({ codigo: data.codigo });
  if (data.nombre !== undefined) conditions.push({ nombre: data.nombre });
  if (!conditions.length) return;
  const where = { [Op.or]: conditions };
  if (excludedId) where.id = { [Op.ne]: excludedId };
  if (await TipoMovimiento.findOne({ where, attributes: ['id'] })) throw new ApiError(409, 'Ya existe un tipo de movimiento con ese código o nombre.');
};

exports.create = async (req, res, next) => { try { const data = buildData(req.body); await ensureUnique(data); return res.status(201).json(await TipoMovimiento.create(data)); } catch (e) { return next(e); } };
exports.findAll = async (_req, res, next) => { try { return res.status(200).json(await TipoMovimiento.findAll({ order: [['id', 'ASC']] })); } catch (e) { return next(e); } };
exports.findById = async (req, res, next) => { try { const item = await TipoMovimiento.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Tipo de movimiento no encontrado.'); return res.status(200).json(item); } catch (e) { return next(e); } };
exports.update = async (req, res, next) => { try { const data = buildData(req.body, true); const item = await TipoMovimiento.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Tipo de movimiento no encontrado.'); await ensureUnique(data, item.id); await item.update(data); return res.status(200).json(item); } catch (e) { return next(e); } };
exports.remove = async (req, res, next) => { try { const item = await TipoMovimiento.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Tipo de movimiento no encontrado.'); await item.update({ activo: false }); return res.status(200).json({ message: 'Tipo de movimiento desactivado correctamente.' }); } catch (e) { return next(e); } };
