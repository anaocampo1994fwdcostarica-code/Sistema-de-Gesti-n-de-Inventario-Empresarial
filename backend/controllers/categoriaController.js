const { Op } = require('sequelize');
const { Categoria, Producto } = require('../models');
const {
  ApiError,
  assertBody,
  assertRequired,
  normalizeOptionalString,
  normalizeRequiredString,
} = require('../middlewares/validation');

const fields = ['nombre', 'descripcion'];

const buildData = (body, isUpdate = false) => {
  assertBody(body, fields, { requireAtLeastOne: isUpdate });
  if (!isUpdate) assertRequired(body, ['nombre']);

  const data = {};
  if (body.nombre !== undefined) data.nombre = normalizeRequiredString(body.nombre, 'nombre', 100);
  if (body.descripcion !== undefined) {
    data.descripcion = normalizeOptionalString(body.descripcion, 'descripcion', 255);
  }
  return data;
};

const ensureUniqueName = async (nombre, excludedId) => {
  if (nombre === undefined) return;
  const where = { nombre };
  if (excludedId) where.id = { [Op.ne]: excludedId };
  if (await Categoria.findOne({ where, attributes: ['id'] })) {
    throw new ApiError(409, 'Ya existe una categoría con ese nombre.');
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = buildData(req.body);
    await ensureUniqueName(data.nombre);
    const categoria = await Categoria.create(data);
    return res.status(201).json(categoria);
  } catch (error) {
    return next(error);
  }
};

exports.findAll = async (_req, res, next) => {
  try {
    const categorias = await Categoria.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json(categorias);
  } catch (error) {
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.resourceId);
    if (!categoria) throw new ApiError(404, 'Categoría no encontrada.');
    return res.status(200).json(categoria);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = buildData(req.body, true);
    const categoria = await Categoria.findByPk(req.resourceId);
    if (!categoria) throw new ApiError(404, 'Categoría no encontrada.');
    await ensureUniqueName(data.nombre, categoria.id);
    await categoria.update(data);
    return res.status(200).json(categoria);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const categoria = await Categoria.findByPk(req.resourceId);
    if (!categoria) throw new ApiError(404, 'Categoría no encontrada.');
    if (await Producto.count({ where: { categoriaId: categoria.id } })) {
      throw new ApiError(409, 'No se puede eliminar una categoría que tiene productos asociados.');
    }
    await categoria.destroy();
    return res.status(200).json({ message: 'Categoría eliminada correctamente.' });
  } catch (error) {
    return next(error);
  }
};
