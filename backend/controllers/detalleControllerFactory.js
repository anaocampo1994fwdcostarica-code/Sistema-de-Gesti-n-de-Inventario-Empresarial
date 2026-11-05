const { Producto, Ubicacion } = require('../models');
const { ApiError, assertBody, assertPositiveInteger, assertRequired } = require('../middlewares/validation');
const { subtotal } = require('../services/money');

module.exports = ({ Detail, Parent, foreignKey, unitField, include, recalculate }) => {
  const fields = [foreignKey, 'productoId', 'ubicacionId', 'cantidad', unitField];
  const validateRelations = async (data) => {
    if (data.productoId !== undefined && !await Producto.findByPk(data.productoId, { attributes: ['id'] })) throw new ApiError(400, 'Producto no encontrado.');
    if (data.ubicacionId !== undefined && !await Ubicacion.findOne({ where: { id: data.ubicacionId, activo: true }, attributes: ['id'] })) throw new ApiError(400, 'Ubicación no encontrada o inactiva.');
  };
  const ensureDraft = async (id) => { const parent = await Parent.findByPk(id); if (!parent) throw new ApiError(404, 'Documento no encontrado.'); if (parent.estado !== 'BORRADOR') throw new ApiError(409, 'Los detalles de un documento confirmado son inmutables.'); return parent; };
  return {
    async create(req, res, next) { try { assertBody(req.body, fields); assertRequired(req.body, fields); const parentId = assertPositiveInteger(req.body[foreignKey], foreignKey); await ensureDraft(parentId); const data = { [foreignKey]: parentId, productoId: assertPositiveInteger(req.body.productoId, 'productoId'), ubicacionId: assertPositiveInteger(req.body.ubicacionId, 'ubicacionId'), cantidad: assertPositiveInteger(req.body.cantidad, 'cantidad') }; data[unitField] = req.body[unitField]; await validateRelations(data); data.subtotal = subtotal(data.cantidad, data[unitField], unitField); const item = await Detail.create(data); await recalculate(parentId); return res.status(201).json(await Detail.findByPk(item.id, { include })); } catch (e) { return next(e); } },
    async findAll(_req, res, next) { try { return res.status(200).json(await Detail.findAll({ include, order: [['id', 'ASC']] })); } catch (e) { return next(e); } },
    async findById(req, res, next) { try { const item = await Detail.findByPk(req.resourceId, { include }); if (!item) throw new ApiError(404, 'Detalle no encontrado.'); return res.status(200).json(item); } catch (e) { return next(e); } },
    async update(req, res, next) { try { assertBody(req.body, ['productoId', 'ubicacionId', 'cantidad', unitField], { requireAtLeastOne: true }); const item = await Detail.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Detalle no encontrado.'); await ensureDraft(item[foreignKey]); const data = {}; if (req.body.productoId !== undefined) data.productoId = assertPositiveInteger(req.body.productoId, 'productoId'); if (req.body.ubicacionId !== undefined) data.ubicacionId = assertPositiveInteger(req.body.ubicacionId, 'ubicacionId'); if (req.body.cantidad !== undefined) data.cantidad = assertPositiveInteger(req.body.cantidad, 'cantidad'); if (req.body[unitField] !== undefined) data[unitField] = req.body[unitField]; await validateRelations(data); const quantity = data.cantidad ?? item.cantidad; const unit = data[unitField] ?? item[unitField]; data.subtotal = subtotal(quantity, unit, unitField); await item.update(data); await recalculate(item[foreignKey]); return res.status(200).json(await Detail.findByPk(item.id, { include })); } catch (e) { return next(e); } },
    async remove(req, res, next) { try { const item = await Detail.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Detalle no encontrado.'); await ensureDraft(item[foreignKey]); const parentId = item[foreignKey]; await item.destroy(); await recalculate(parentId); return res.status(200).json({ message: 'Detalle eliminado correctamente.' }); } catch (e) { return next(e); } },
  };
};
