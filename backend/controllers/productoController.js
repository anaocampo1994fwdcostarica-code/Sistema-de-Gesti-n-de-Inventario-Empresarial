const { Op } = require('sequelize');
const { Categoria, Producto, Proveedor } = require('../models');
const { createProductWithInitialStock } = require('../services/productoService');
const {
  ApiError,
  assertBody,
  assertPositiveInteger,
  assertRequired,
  normalizeRequiredString,
} = require('../middlewares/validation');

const fields = ['nombre', 'codigo', 'precio', 'cantidad', 'categoriaId', 'proveedorId'];
const createFields = [...fields, 'ubicacionId', 'tipoMovimientoId'];
const includeRelations = [
  { model: Categoria, as: 'categoria', attributes: ['id', 'nombre'] },
  { model: Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] },
];

const validatePrice = (value) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 99999999.99) {
    throw new ApiError(400, 'precio debe ser un número entre 0 y 99999999.99.');
  }
  if (!/^\d+(\.\d{1,2})?$/.test(String(value))) {
    throw new ApiError(400, 'precio puede tener como máximo dos decimales.');
  }
  return value;
};

const validateQuantity = (value) => {
  if (!Number.isSafeInteger(value) || value < 0 || value > 4294967295) {
    throw new ApiError(400, 'cantidad debe ser un entero no negativo válido.');
  }
  return value;
};

const buildData = (body, isUpdate = false) => {
  assertBody(body, isUpdate ? fields : createFields, { requireAtLeastOne: isUpdate });
  if (!isUpdate) assertRequired(body, fields);

  const data = {};
  if (body.nombre !== undefined) data.nombre = normalizeRequiredString(body.nombre, 'nombre', 100);
  if (body.codigo !== undefined) data.codigo = normalizeRequiredString(body.codigo, 'codigo', 30);
  if (body.precio !== undefined) data.precio = validatePrice(body.precio);
  if (body.cantidad !== undefined) data.cantidad = validateQuantity(body.cantidad);
  if (body.categoriaId !== undefined) {
    data.categoriaId = assertPositiveInteger(body.categoriaId, 'categoriaId');
  }
  if (body.proveedorId !== undefined) {
    data.proveedorId = assertPositiveInteger(body.proveedorId, 'proveedorId');
  }
  if (!isUpdate && body.ubicacionId !== undefined) data.ubicacionId = assertPositiveInteger(body.ubicacionId, 'ubicacionId');
  if (!isUpdate && body.tipoMovimientoId !== undefined) data.tipoMovimientoId = assertPositiveInteger(body.tipoMovimientoId, 'tipoMovimientoId');
  return data;
};

const ensureUniqueCode = async (codigo, excludedId) => {
  if (codigo === undefined) return;
  const where = { codigo };
  if (excludedId) where.id = { [Op.ne]: excludedId };
  if (await Producto.findOne({ where, attributes: ['id'] })) {
    throw new ApiError(409, 'Ya existe un producto con ese código.');
  }
};

const ensureRelationsExist = async (data) => {
  const checks = [];
  if (data.categoriaId !== undefined) {
    checks.push(Categoria.findByPk(data.categoriaId, { attributes: ['id'] }).then((item) => ['categoriaId', item]));
  }
  if (data.proveedorId !== undefined) {
    checks.push(Proveedor.findByPk(data.proveedorId, { attributes: ['id'] }).then((item) => ['proveedorId', item]));
  }

  const results = await Promise.all(checks);
  const missing = results.filter(([, item]) => !item).map(([field]) => field);
  if (missing.length) {
    throw new ApiError(400, 'La categoría o el proveedor indicado no existe.', missing);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = buildData(req.body);
    if (data.cantidad > 0 && (!data.ubicacionId || !data.tipoMovimientoId)) throw new ApiError(400, 'La ubicación y el tipo manual de entrada son obligatorios cuando la cantidad inicial es mayor que cero.');
    await Promise.all([ensureUniqueCode(data.codigo), ensureRelationsExist(data)]);
    const { cantidad, ubicacionId, tipoMovimientoId, ...productData } = data;
    const producto = await createProductWithInitialStock({ productData, initialQuantity: cantidad, ubicacionId, tipoMovimientoId, usuarioId: req.user.id });
    const result = await Producto.findByPk(producto.id, { include: includeRelations });
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

exports.findAll = async (_req, res, next) => {
  try {
    const productos = await Producto.findAll({ include: includeRelations, order: [['id', 'ASC']] });
    return res.status(200).json(productos);
  } catch (error) {
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.resourceId, { include: includeRelations });
    if (!producto) throw new ApiError(404, 'Producto no encontrado.');
    return res.status(200).json(producto);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = buildData(req.body, true);
    const producto = await Producto.findByPk(req.resourceId);
    if (!producto) throw new ApiError(404, 'Producto no encontrado.');
    if (data.cantidad !== undefined) {
      if (data.cantidad !== Number(producto.cantidad)) {
        throw new ApiError(403, 'La cantidad solo puede cambiar mediante movimientos de inventario.');
      }
      delete data.cantidad;
    }
    await Promise.all([ensureUniqueCode(data.codigo, producto.id), ensureRelationsExist(data)]);
    await producto.update(data);
    const result = await Producto.findByPk(producto.id, { include: includeRelations });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const producto = await Producto.findByPk(req.resourceId);
    if (!producto) throw new ApiError(404, 'Producto no encontrado.');
    await producto.destroy();
    return res.status(200).json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    return next(error);
  }
};
