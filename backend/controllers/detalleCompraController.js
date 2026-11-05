const { Compra, DetalleCompra, Producto, Ubicacion } = require('../models');
const factory = require('./detalleControllerFactory');
const { recalculateTotal } = require('../services/documentoService');
module.exports = factory({
  Detail: DetalleCompra, Parent: Compra, foreignKey: 'compraId', unitField: 'costoUnitario',
  include: [{ model: Compra, as: 'compra', attributes: ['id', 'estado'] }, { model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] }, { model: Ubicacion, as: 'ubicacion', attributes: ['id', 'codigo', 'nombre'] }],
  recalculate: (id) => recalculateTotal('compra', id),
});
