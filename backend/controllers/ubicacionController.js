const { Op } = require('sequelize');
const { Bodega, Existencia, Ubicacion } = require('../models');
const {
  ApiError,
  assertBody,
  assertPositiveInteger,
  assertRequired,
  normalizeOptionalString,
  normalizeRequiredString,
} = require('../middlewares/validation');

const fields = ['bodegaId', 'codigo', 'nombre', 'pasillo', 'estante', 'nivel', 'activo'];
const includeBodega = [{ model: Bodega, as: 'bodega', attributes: ['id', 'nombre', 'activo'] }];

const buildData = (body, update = false) => {
  assertBody(body, fields, { requireAtLeastOne: update });
  if (!update) assertRequired(body, ['bodegaId', 'codigo', 'nombre']);
  const data = {};
  if (body.bodegaId !== undefined) data.bodegaId = assertPositiveInteger(body.bodegaId, 'bodegaId');
  if (body.codigo !== undefined) data.codigo = normalizeRequiredString(body.codigo, 'codigo', 50).toUpperCase();
  if (body.nombre !== undefined) data.nombre = normalizeRequiredString(body.nombre, 'nombre', 100);
  for (const [field, length] of [['pasillo', 30], ['estante', 30], ['nivel', 30]]) {
    if (body[field] !== undefined) data[field] = normalizeOptionalString(body[field], field, length);
  }
  if (body.activo !== undefined) {
    if (typeof body.activo !== 'boolean') throw new ApiError(400, 'activo debe ser booleano.');
    data.activo = body.activo;
  }
  return data;
};

const ensureBodega = async (bodegaId) => {
  if (bodegaId === undefined) return;
  const bodega = await Bodega.findByPk(bodegaId, { attributes: ['id', 'activo'] });
  if (!bodega || !bodega.activo) throw new ApiError(400, 'La bodega indicada no existe o está inactiva.');
};

const ensureUniqueCode = async (bodegaId, codigo, excludedId) => {
  if (bodegaId === undefined || codigo === undefined) return;
  const where = { bodegaId, codigo };
  if (excludedId) where.id = { [Op.ne]: excludedId };
  if (await Ubicacion.findOne({ where, attributes: ['id'] })) {
    throw new ApiError(409, 'Ya existe una ubicación con ese código en la bodega.');
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = buildData(req.body);
    await Promise.all([ensureBodega(data.bodegaId), ensureUniqueCode(data.bodegaId, data.codigo)]);
    const item = await Ubicacion.create(data);
    return res.status(201).json(await Ubicacion.findByPk(item.id, { include: includeBodega }));
  } catch (error) { return next(error); }
};

exports.findAll = async (_req, res, next) => {
  try { return res.status(200).json(await Ubicacion.findAll({ include: includeBodega, order: [['id', 'ASC']] })); }
  catch (error) { return next(error); }
};

exports.findById = async (req, res, next) => {
  try {
    const item = await Ubicacion.findByPk(req.resourceId, { include: includeBodega });
    if (!item) throw new ApiError(404, 'Ubicación no encontrada.');
    return res.status(200).json(item);
  } catch (error) { return next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const data = buildData(req.body, true);
    const item = await Ubicacion.findByPk(req.resourceId);
    if (!item) throw new ApiError(404, 'Ubicación no encontrada.');
    const finalBodegaId = data.bodegaId ?? item.bodegaId;
    const finalCodigo = data.codigo ?? item.codigo;
    await Promise.all([ensureBodega(data.bodegaId), ensureUniqueCode(finalBodegaId, finalCodigo, item.id)]);
    await item.update(data);
    return res.status(200).json(await Ubicacion.findByPk(item.id, { include: includeBodega }));
  } catch (error) { return next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Ubicacion.findByPk(req.resourceId);
    if (!item) throw new ApiError(404, 'Ubicación no encontrada.');
    if (await Existencia.count({ where: { ubicacionId: item.id } })) {
      throw new ApiError(409, 'No se puede desactivar una ubicación con existencias asociadas.');
    }
    await item.update({ activo: false });
    return res.status(200).json({ message: 'Ubicación desactivada correctamente.' });
  } catch (error) { return next(error); }
};
