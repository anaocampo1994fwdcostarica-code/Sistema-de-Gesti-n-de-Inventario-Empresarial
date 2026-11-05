const { Op } = require('sequelize');
const { Cliente } = require('../models');
const { ApiError, assertBody, assertRequired, normalizeOptionalString, normalizeRequiredString } = require('../middlewares/validation');

const fields = ['nombre', 'documento', 'correo', 'telefono', 'direccion', 'activo'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const buildData = (body, update = false) => {
  assertBody(body, fields, { requireAtLeastOne: update });
  if (!update) assertRequired(body, ['nombre']);
  const data = {};
  if (body.nombre !== undefined) data.nombre = normalizeRequiredString(body.nombre, 'nombre', 120);
  for (const [field, length] of [['documento', 50], ['correo', 150], ['telefono', 20], ['direccion', 255]]) {
    if (body[field] !== undefined) data[field] = normalizeOptionalString(body[field], field, length);
  }
  if (data.correo) { data.correo = data.correo.toLowerCase(); if (!emailPattern.test(data.correo)) throw new ApiError(400, 'correo debe tener un formato válido.'); }
  if (body.activo !== undefined) { if (typeof body.activo !== 'boolean') throw new ApiError(400, 'activo debe ser booleano.'); data.activo = body.activo; }
  return data;
};
const ensureUniqueDocument = async (documento, excludedId) => {
  if (!documento) return;
  const where = { documento };
  if (excludedId) where.id = { [Op.ne]: excludedId };
  if (await Cliente.findOne({ where, attributes: ['id'] })) throw new ApiError(409, 'Ya existe un cliente con ese documento.');
};

exports.create = async (req, res, next) => { try { const data = buildData(req.body); await ensureUniqueDocument(data.documento); return res.status(201).json(await Cliente.create(data)); } catch (e) { return next(e); } };
exports.findAll = async (_req, res, next) => { try { return res.status(200).json(await Cliente.findAll({ order: [['id', 'ASC']] })); } catch (e) { return next(e); } };
exports.findById = async (req, res, next) => { try { const item = await Cliente.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Cliente no encontrado.'); return res.status(200).json(item); } catch (e) { return next(e); } };
exports.update = async (req, res, next) => { try { const data = buildData(req.body, true); const item = await Cliente.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Cliente no encontrado.'); await ensureUniqueDocument(data.documento, item.id); await item.update(data); return res.status(200).json(item); } catch (e) { return next(e); } };
exports.remove = async (req, res, next) => { try { const item = await Cliente.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Cliente no encontrado.'); await item.update({ activo: false }); return res.status(200).json({ message: 'Cliente desactivado correctamente.' }); } catch (e) { return next(e); } };
