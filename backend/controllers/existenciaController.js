const { Bodega, Existencia, Producto, Ubicacion } = require('../models');
const { ApiError } = require('../middlewares/validation');

const includeRelations = [
  { model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] },
  {
    model: Ubicacion,
    as: 'ubicacion',
    attributes: ['id', 'codigo', 'nombre', 'bodegaId'],
    include: [{ model: Bodega, as: 'bodega', attributes: ['id', 'nombre'] }],
  },
];

const restricted = (_req, _res, next) => next(new ApiError(
  403,
  'Las cantidades de inventario solo pueden modificarse mediante servicios transaccionales autorizados.',
));

exports.create = restricted;

exports.findAll = async (_req, res, next) => {
  try { return res.status(200).json(await Existencia.findAll({ include: includeRelations, order: [['id', 'ASC']] })); }
  catch (error) { return next(error); }
};

exports.findById = async (req, res, next) => {
  try {
    const item = await Existencia.findByPk(req.resourceId, { include: includeRelations });
    if (!item) throw new ApiError(404, 'Existencia no encontrada.');
    return res.status(200).json(item);
  } catch (error) { return next(error); }
};

exports.update = restricted;
exports.remove = restricted;
