const { Proveedor, Producto } = require('../models');
const {
  ApiError,
  assertBody,
  assertRequired,
  normalizeOptionalString,
  normalizeRequiredString,
} = require('../middlewares/validation');

const fields = ['nombre', 'telefono', 'correo'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildData = (body, isUpdate = false) => {
  assertBody(body, fields, { requireAtLeastOne: isUpdate });
  if (!isUpdate) assertRequired(body, ['nombre']);

  const data = {};
  if (body.nombre !== undefined) data.nombre = normalizeRequiredString(body.nombre, 'nombre', 100);
  if (body.telefono !== undefined) data.telefono = normalizeOptionalString(body.telefono, 'telefono', 20);
  if (body.correo !== undefined) {
    data.correo = normalizeOptionalString(body.correo, 'correo', 150);
    if (data.correo && !emailPattern.test(data.correo)) {
      throw new ApiError(400, 'correo debe tener un formato válido.');
    }
  }
  return data;
};

exports.create = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.create(buildData(req.body));
    return res.status(201).json(proveedor);
  } catch (error) {
    return next(error);
  }
};

exports.findAll = async (_req, res, next) => {
  try {
    const proveedores = await Proveedor.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json(proveedores);
  } catch (error) {
    return next(error);
  }
};

exports.findById = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.findByPk(req.resourceId);
    if (!proveedor) throw new ApiError(404, 'Proveedor no encontrado.');
    return res.status(200).json(proveedor);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = buildData(req.body, true);
    const proveedor = await Proveedor.findByPk(req.resourceId);
    if (!proveedor) throw new ApiError(404, 'Proveedor no encontrado.');
    await proveedor.update(data);
    return res.status(200).json(proveedor);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.findByPk(req.resourceId);
    if (!proveedor) throw new ApiError(404, 'Proveedor no encontrado.');
    if (await Producto.count({ where: { proveedorId: proveedor.id } })) {
      throw new ApiError(409, 'No se puede eliminar un proveedor que tiene productos asociados.');
    }
    await proveedor.destroy();
    return res.status(200).json({ message: 'Proveedor eliminado correctamente.' });
  } catch (error) {
    return next(error);
  }
};
