const { Cliente, DetalleVenta, Producto, Ubicacion, Usuario, Venta } = require('../models');
const factory = require('./documentoControllerFactory');
const { confirmDocument } = require('../services/documentoService');
const include = [
  { model: Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
  { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
  { model: DetalleVenta, as: 'detalles', include: [{ model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] }, { model: Ubicacion, as: 'ubicacion', attributes: ['id', 'codigo', 'nombre'] }] },
];
module.exports = factory({ Model: Venta, relationField: 'clienteId', relationModel: Cliente, relationName: 'Cliente', include, confirm: (id, key, userId) => confirmDocument('venta', id, key, userId) });
