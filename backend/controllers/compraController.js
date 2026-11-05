const { Compra, DetalleCompra, Producto, Proveedor, Ubicacion, Usuario } = require('../models');
const factory = require('./documentoControllerFactory');
const { confirmDocument } = require('../services/documentoService');
const include = [
  { model: Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] },
  { model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'correo'] },
  { model: DetalleCompra, as: 'detalles', include: [{ model: Producto, as: 'producto', attributes: ['id', 'codigo', 'nombre'] }, { model: Ubicacion, as: 'ubicacion', attributes: ['id', 'codigo', 'nombre'] }] },
];
module.exports = factory({ Model: Compra, relationField: 'proveedorId', relationModel: Proveedor, relationName: 'Proveedor', include, confirm: (id, key, userId) => confirmDocument('compra', id, key, userId) });
