const { Op } = require('sequelize');
const { Bodega } = require('../models');
const { ApiError, assertBody, assertRequired, normalizeOptionalString, normalizeRequiredString } = require('../middlewares/validation');

const fields = ['nombre', 'descripcion', 'direccion', 'activo'];
const booleanValue = (value, field) => { if (typeof value !== 'boolean') throw new ApiError(400, `${field} debe ser booleano.`); return value; };
const buildData = (body, update = false) => {
  assertBody(body, fields, { requireAtLeastOne: update });
  if (!update) assertRequired(body, ['nombre']);
  const data = {};
  if (body.nombre !== undefined) data.nombre = normalizeRequiredString(body.nombre, 'nombre', 100);
  if (body.descripcion !== undefined) data.descripcion = normalizeOptionalString(body.descripcion, 'descripcion', 255);
  if (body.direccion !== undefined) data.direccion = normalizeOptionalString(body.direccion, 'direccion', 255);
  if (body.activo !== undefined) data.activo = booleanValue(body.activo, 'activo');
  return data;
};
const ensureUnique = async (nombre, excludedId) => {
  if (nombre === undefined) return;
  const where = { nombre };
  if (excludedId) where.id = { [Op.ne]: excludedId };
  if (await Bodega.findOne({ where, attributes: ['id'] })) throw new ApiError(409, 'Ya existe una bodega con ese nombre.');
};

exports.create = async (req, res, next) => { try { const data = buildData(req.body); await ensureUnique(data.nombre); return res.status(201).json(await Bodega.create(data)); } catch (e) { return next(e); } };
exports.findAll = async (_req, res, next) => { try { return res.status(200).json(await Bodega.findAll({ order: [['id', 'ASC']] })); } catch (e) { return next(e); } };
exports.findById = async (req, res, next) => { try { const item = await Bodega.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Bodega no encontrada.'); return res.status(200).json(item); } catch (e) { return next(e); } };
exports.update = async (req, res, next) => { try { const data = buildData(req.body, true); const item = await Bodega.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Bodega no encontrada.'); await ensureUnique(data.nombre, item.id); await item.update(data); return res.status(200).json(item); } catch (e) { return next(e); } };
exports.remove = async (req, res, next) => { try { const item = await Bodega.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Bodega no encontrada.'); await item.update({ activo: false }); return res.status(200).json({ message: 'Bodega desactivada correctamente.' }); } catch (e) { return next(e); } };
