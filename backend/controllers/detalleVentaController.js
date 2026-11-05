const { DetalleVenta, Producto, Ubicacion, Venta } = require('../models');
const factory = require('./detalleControllerFactory');
const { recalculateTotal } = require('../services/documentoService');
module.exports = factory({
  Detail: DetalleVenta, Parent: Venta, foreignKey: 'ventaId', unitField: 'precioUnitario',
  include: [{ model: Venta, as: 'venta', attributes: ['id', 'estado'] }, { model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] }, { model: Ubicacion, as: 'ubicacion', attributes: ['id', 'codigo', 'nombre'] }],
  recalculate: (id) => recalculateTotal('venta', id),
});
