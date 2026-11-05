const { ApiError, assertBody, assertPositiveInteger, assertRequired } = require('../middlewares/validation');

module.exports = ({ Model, relationField, relationModel, relationName, include, confirm }) => ({
  async create(req, res, next) {
    try {
      assertBody(req.body, [relationField, 'fecha']); assertRequired(req.body, [relationField]);
      const relationId = assertPositiveInteger(req.body[relationField], relationField);
      const relation = await relationModel.findByPk(relationId, { attributes: ['id', ...(relationField === 'clienteId' ? ['activo'] : [])] });
      if (!relation || relation.activo === false) throw new ApiError(400, `${relationName} no existe o está inactivo.`);
      const fecha = req.body.fecha ? new Date(req.body.fecha) : new Date();
      if (Number.isNaN(fecha.getTime())) throw new ApiError(400, 'fecha no es válida.');
      const item = await Model.create({ [relationField]: relationId, usuarioId: req.user.id, fecha, estado: 'BORRADOR', total: 0 });
      return res.status(201).json(await Model.findByPk(item.id, { include }));
    } catch (e) { return next(e); }
  },
  async findAll(_req, res, next) { try { return res.status(200).json(await Model.findAll({ include, order: [['id', 'ASC']] })); } catch (e) { return next(e); } },
  async findById(req, res, next) { try { const item = await Model.findByPk(req.resourceId, { include }); if (!item) throw new ApiError(404, 'Documento no encontrado.'); return res.status(200).json(item); } catch (e) { return next(e); } },
  async update(req, res, next) {
    try {
      assertBody(req.body, [relationField, 'fecha'], { requireAtLeastOne: true });
      const item = await Model.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Documento no encontrado.');
      if (item.estado !== 'BORRADOR') throw new ApiError(409, 'Solo se pueden editar documentos en borrador.');
      const data = {};
      if (req.body[relationField] !== undefined) { data[relationField] = assertPositiveInteger(req.body[relationField], relationField); const relation = await relationModel.findByPk(data[relationField]); if (!relation || relation.activo === false) throw new ApiError(400, `${relationName} no existe o está inactivo.`); }
      if (req.body.fecha !== undefined) { data.fecha = new Date(req.body.fecha); if (Number.isNaN(data.fecha.getTime())) throw new ApiError(400, 'fecha no es válida.'); }
      await item.update(data); return res.status(200).json(await Model.findByPk(item.id, { include }));
    } catch (e) { return next(e); }
  },
  async remove(req, res, next) { try { const item = await Model.findByPk(req.resourceId); if (!item) throw new ApiError(404, 'Documento no encontrado.'); if (item.estado !== 'BORRADOR') throw new ApiError(409, 'Solo se pueden eliminar documentos en borrador.'); await item.destroy(); return res.status(200).json({ message: 'Documento eliminado correctamente.' }); } catch (e) { return next(e); } },
  async confirm(req, res, next) { try { assertBody(req.body, ['claveIdempotencia']); assertRequired(req.body, ['claveIdempotencia']); const result = await confirm(req.resourceId, req.body.claveIdempotencia, req.user.id); return res.status(200).json({ repetida: result.repeated, documento: await Model.findByPk(result.document.id, { include }) }); } catch (e) { return next(e); } },
});
