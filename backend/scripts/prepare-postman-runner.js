'use strict';

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..', '..');
const sourcePath = path.join(projectRoot, 'docs', 'postman', 'Inventario_Empresarial.postman_collection.json');
const outputPath = process.argv[2];

if (!outputPath) throw new Error('Indique la ruta temporal de salida.');

const collection = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const requests = new Map();
const collect = (node) => {
  for (const item of node.item || []) {
    if (item.request) requests.set(item.name, structuredClone(item));
    else collect(item);
  }
};
collect(collection);

const order = [
  'Registrar usuario', 'Iniciar sesión', 'Consultar perfil autenticado',
  'Listar Usuarios', 'Crear Usuarios', 'Consultar Usuarios por ID', 'Actualizar Usuarios por ID',
  'Listar Categorías', 'Crear Categorías', 'Consultar Categorías por ID', 'Actualizar Categorías por ID',
  'Listar Proveedores', 'Crear Proveedores', 'Consultar Proveedores por ID', 'Actualizar Proveedores por ID',
  'Listar Bodegas', 'Crear Bodegas', 'Consultar Bodegas por ID', 'Actualizar Bodegas por ID',
  'Listar Ubicaciones', 'Crear Ubicaciones', 'Consultar Ubicaciones por ID', 'Actualizar Ubicaciones por ID',
  'Listar Tipos de movimiento', 'Crear Tipos de movimiento', 'Consultar Tipos de movimiento por ID', 'Actualizar Tipos de movimiento por ID',
  'Listar Productos', 'Crear Productos', 'Consultar Productos por ID', 'Actualizar Productos por ID',
  'Crear Movimientos', 'Listar Movimientos', 'Consultar Movimientos por ID', 'Actualizar Movimientos por ID', 'Eliminar Movimientos por ID',
  'Listar Existencias', 'Consultar Existencias por ID', 'Crear Existencias', 'Actualizar Existencias por ID', 'Eliminar Existencias por ID',
  'Listar Clientes', 'Crear Clientes', 'Consultar Clientes por ID', 'Actualizar Clientes por ID',
  'Listar Compras', 'Crear Compras', 'Consultar Compras por ID', 'Actualizar Compras por ID',
  'Listar Detalles de compra', 'Crear Detalles de compra', 'Consultar Detalles de compra por ID', 'Actualizar Detalles de compra por ID', 'Confirmar compra',
  'Eliminar Detalles de compra por ID', 'Eliminar Compras por ID',
  'Listar Ventas', 'Crear Ventas', 'Consultar Ventas por ID', 'Actualizar Ventas por ID',
  'Listar Detalles de venta', 'Crear Detalles de venta', 'Consultar Detalles de venta por ID', 'Actualizar Detalles de venta por ID', 'Confirmar venta',
  'Eliminar Detalles de venta por ID', 'Eliminar Ventas por ID',
  'Listar Ajustes de inventario', 'Crear Ajustes de inventario', 'Consultar Ajustes de inventario por ID', 'Actualizar Ajustes de inventario por ID', 'Eliminar Ajustes de inventario por ID',
  '400 - Registro sin campos obligatorios', '400 - Login con correo inválido', '400 - Categoría sin nombre', '400 - Cliente con correo inválido', '400 - Producto con cantidad negativa', '400 - ID con formato incorrecto',
  '401 - Perfil sin JWT', '401 - Productos sin JWT', '401 - Token inválido', '401 - Credenciales incorrectas',
  '404 - Categoría inexistente', '404 - Producto inexistente', '404 - Ruta API inexistente',
  'Eliminar Productos por ID', 'Eliminar Ubicaciones por ID', 'Eliminar Categorías por ID', 'Eliminar Proveedores por ID',
  'Eliminar Tipos de movimiento por ID', 'Eliminar Bodegas por ID', 'Eliminar Clientes por ID', 'Eliminar Usuarios por ID',
];

if (requests.size !== 93 || order.length !== 93 || order.some((name) => !requests.has(name))) {
  throw new Error('La colección fuente no coincide con las 93 solicitudes esperadas.');
}

const setBody = (name, data) => {
  requests.get(name).request.body.raw = JSON.stringify(data, null, 2);
};
const setExpectedStatus = (name, status) => {
  const script = requests.get(name).event[0].script.exec;
  script[0] = 'pm.test("Estado HTTP ' + status + '", function () { pm.response.to.have.status(' + status + '); });';
  if (status >= 400 && !script.some((line) => line.includes('Incluye mensaje de error'))) {
    script.push(
      'pm.test("Incluye mensaje de error", function () {',
      '  pm.expect(pm.response.json()).to.have.property("error").that.is.a("string").and.not.empty;',
      '});',
    );
  }
};

setBody('Actualizar Usuarios por ID', { nombre: 'Usuario Postman actualizado' });
setBody('Crear Categorías', { nombre: 'Categoría Postman {{$timestamp}}', descripcion: 'Runner aislado' });
setBody('Actualizar Categorías por ID', { nombre: 'Categoría Postman actualizada {{$timestamp}}', descripcion: 'Runner aislado' });
setBody('Crear Proveedores', { nombre: 'Proveedor Postman {{$timestamp}}', telefono: '2222-2222', correo: null });
setBody('Actualizar Proveedores por ID', { nombre: 'Proveedor Postman actualizado {{$timestamp}}', telefono: '2222-2222', correo: null });
setBody('Crear Bodegas', { nombre: 'Bodega Postman {{$timestamp}}', descripcion: 'Runner aislado', direccion: null, activo: true });
setBody('Actualizar Bodegas por ID', { nombre: 'Bodega Postman actualizada {{$timestamp}}', activo: true });
setBody('Crear Ubicaciones', { bodegaId: '{{bodegaId}}', codigo: 'U-{{$timestamp}}', nombre: 'Ubicación Postman', activo: true });
setBody('Actualizar Ubicaciones por ID', { nombre: 'Ubicación Postman actualizada', activo: true });
setBody('Crear Tipos de movimiento', { codigo: 'PME-{{$timestamp}}', nombre: 'Entrada Postman {{$timestamp}}', efecto: 'ENTRADA', activo: true });
setBody('Actualizar Tipos de movimiento por ID', { nombre: 'Entrada Postman actualizada {{$timestamp}}', activo: true });
setBody('Crear Productos', { nombre: 'Producto Postman', codigo: 'P-{{$timestamp}}', precio: 1250.5, cantidad: 0, categoriaId: '{{categoriaId}}', proveedorId: '{{proveedorId}}' });
setBody('Actualizar Productos por ID', { nombre: 'Producto Postman actualizado', precio: 1250.5, cantidad: 0, categoriaId: '{{categoriaId}}', proveedorId: '{{proveedorId}}' });
setBody('Crear Clientes', { nombre: 'Cliente Postman', documento: 'D-{{$timestamp}}', correo: null, activo: true });
setBody('Actualizar Clientes por ID', { nombre: 'Cliente Postman actualizado', activo: true });
setBody('Actualizar Detalles de compra por ID', { productoId: '{{productoId}}', ubicacionId: '{{ubicacionId}}', cantidad: 3, costoUnitario: 1000 });
setBody('Actualizar Detalles de venta por ID', { productoId: '{{productoId}}', ubicacionId: '{{ubicacionId}}', cantidad: 1, precioUnitario: 1500 });

for (const name of [
  'Eliminar Productos por ID', 'Eliminar Ubicaciones por ID', 'Eliminar Categorías por ID', 'Eliminar Proveedores por ID',
  'Eliminar Detalles de compra por ID', 'Eliminar Compras por ID', 'Eliminar Detalles de venta por ID', 'Eliminar Ventas por ID',
]) setExpectedStatus(name, 409);

requests.get('Crear Ubicaciones').event[0].script.exec.push(
  'if (response && response.id) {',
  '  pm.collectionVariables.set("ubicacionDestinoId", response.id);',
  '  pm.collectionVariables.set("ubicacionOrigenId", response.id);',
  '}',
);
requests.get('Listar Existencias').event[0].script.exec.push(
  'const existencias = pm.response.json();',
  'const encontrada = existencias.find(function (item) {',
  '  return String(item.productoId) === String(pm.collectionVariables.get("productoId")) && String(item.ubicacionId) === String(pm.collectionVariables.get("ubicacionId"));',
  '});',
  'pm.test("Existe la existencia generada por el movimiento", function () { pm.expect(encontrada).to.be.an("object"); });',
  'if (encontrada) pm.collectionVariables.set("existenciaId", encontrada.id);',
);
const ajusteCreateScript = requests.get('Crear Ajustes de inventario').event[0].script.exec;
ajusteCreateScript[6] = 'if (response && response.ajuste && response.ajuste.id) pm.collectionVariables.set("ajusteId", response.ajuste.id);';
ajusteCreateScript[7] = 'pm.test("Incluye un identificador", function () { pm.expect(response.ajuste && response.ajuste.id).to.be.a("number"); });';

collection.info.name += ' - Runner temporal aislado';
collection.info.description = 'Copia temporal con 93 solicitudes para inventario_empresarial_test en puerto 3104.';
const baseUrl = collection.variable.find((item) => item.key === 'baseUrl');
if (!baseUrl) throw new Error('La colección fuente no define baseUrl.');
baseUrl.value = 'http://127.0.0.1:3104';
collection.item = [{ name: 'Ejecución segura (93 solicitudes)', item: order.map((name) => requests.get(name)) }];
for (const item of collection.item[0].item) {
  if (item.request.body?.raw) {
    item.request.body.raw = item.request.body.raw.replace(/"{{([A-Za-z]+Id)}}"/g, '{{$1}}');
  }
}

fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2) + '\n');
console.log(JSON.stringify({ outputPath, requests: order.length, port: 3104, database: 'inventario_empresarial_test' }));
