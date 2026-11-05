'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { after, before, describe, test } = require('node:test');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const backendRoot = path.resolve(__dirname, '..');
const testDb = process.env.TEST_DB_NAME;

let db;
let server;
let baseUrl;
let token;
let user;
let category;
let provider;
let warehouse;
let locationA;
let locationB;
let client;
let types = {};
let product;
let entryMovement;
let purchase;
let sale;
let failedSale;

const request = async (method, route, body, authenticated = true) => {
  const response = await fetch(`${baseUrl}${route}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(authenticated && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
};

const stock = async () => {
  const rows = await db.Existencia.findAll({
    where: { productoId: product.id },
    order: [['ubicacionId', 'ASC']],
  });
  return Object.fromEntries(rows.map((row) => [String(row.ubicacionId), Number(row.cantidad)]));
};

const assertProductTotal = async () => {
  const freshProduct = await db.Producto.findByPk(product.id);
  const total = Number(await db.Existencia.sum('cantidad', { where: { productoId: product.id } })) || 0;
  assert.equal(Number(freshProduct.cantidad), total);
  return total;
};

before(async () => {
  assert.match(testDb, /^[A-Za-z0-9_]+_test$/);
  assert.notEqual(testDb, process.env.DB_NAME || 'inventario_empresarial');
  assert.notEqual(testDb, 'inventario_empresarial');

  const admin = await mysql.createConnection({
    host: process.env.TEST_DB_HOST,
    port: Number(process.env.TEST_DB_PORT),
    user: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD || undefined,
  });
  await admin.query('DROP DATABASE IF EXISTS ??', [testDb]);
  await admin.query('CREATE DATABASE ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', [testDb]);
  await admin.end();

  const config = require('../config/config').test;
  const migrationSequelize = new Sequelize(config);
  const queryInterface = migrationSequelize.getQueryInterface();
  const migrationFiles = fs.readdirSync(path.join(backendRoot, 'migrations'))
    .filter((name) => name.endsWith('.js'))
    .sort();
  for (const file of migrationFiles) {
    const migration = require(path.join(backendRoot, 'migrations', file));
    await migration.up(queryInterface, Sequelize);
  }
  await migrationSequelize.close();

  db = require('../models');
  const app = require('../app');
  await db.sequelize.authenticate();
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const register = await request('POST', '/api/auth/register', {
    nombre: 'Usuario QA automatizado',
    correo: 'qa.automatizado@example.test',
    password: process.env.TEST_USER_PASSWORD,
  }, false);
  assert.equal(register.status, 201);

  const login = await request('POST', '/api/auth/login', {
    correo: 'qa.automatizado@example.test',
    password: process.env.TEST_USER_PASSWORD,
  }, false);
  assert.equal(login.status, 200);
  token = login.body.token;
  user = login.body.usuario;

  category = (await request('POST', '/api/categorias', { nombre: 'QA Categoría', descripcion: 'Fixture automatizado' })).body;
  provider = (await request('POST', '/api/proveedores', { nombre: 'QA Proveedor', correo: 'proveedor.qa@example.test' })).body;
  warehouse = (await request('POST', '/api/bodegas', { nombre: 'QA Bodega', activo: true })).body;
  locationA = (await request('POST', '/api/ubicaciones', { bodegaId: warehouse.id, codigo: 'QA-A', nombre: 'QA Ubicación A', activo: true })).body;
  locationB = (await request('POST', '/api/ubicaciones', { bodegaId: warehouse.id, codigo: 'QA-B', nombre: 'QA Ubicación B', activo: true })).body;
  client = (await request('POST', '/api/clientes', { nombre: 'QA Cliente', documento: 'QA-DOC-001', activo: true })).body;

  for (const definition of [
    ['ENTRADA_QA', 'Entrada QA', 'ENTRADA'],
    ['SALIDA_QA', 'Salida QA', 'SALIDA'],
    ['TRASLADO_QA', 'Traslado QA', 'TRASLADO'],
  ]) {
    const response = await request('POST', '/api/tipos-movimiento', {
      codigo: definition[0], nombre: definition[1], efecto: definition[2], activo: true,
    });
    assert.equal(response.status, 201);
    types[definition[2]] = response.body;
  }
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  if (db?.sequelize) await db.sequelize.close();
});

describe('API de inventario empresarial', { concurrency: false }, () => {
  test('autenticación: login válido', async () => {
    const response = await request('POST', '/api/auth/login', {
      correo: 'qa.automatizado@example.test', password: process.env.TEST_USER_PASSWORD,
    }, false);
    assert.equal(response.status, 200);
    assert.ok(response.body.token);
    assert.equal(response.body.usuario.id, user.id);
    assert.equal(response.body.usuario.passwordHash, undefined);
  });

  test('autenticación: login inválido', async () => {
    const response = await request('POST', '/api/auth/login', {
      correo: 'qa.automatizado@example.test', password: 'Clave-Incorrecta',
    }, false);
    assert.equal(response.status, 401);
  });

  test('autenticación: endpoint protegido sin JWT', async () => {
    assert.equal((await request('GET', '/api/productos', undefined, false)).status, 401);
  });

  test('autenticación: acceso con JWT válido', async () => {
    const response = await request('GET', '/api/auth/me');
    assert.equal(response.status, 200);
    assert.equal(response.body.id, user.id);
    assert.equal(response.body.passwordHash, undefined);
  });

  test('catálogo: crear producto', async () => {
    const response = await request('POST', '/api/productos', {
      nombre: 'Producto QA', codigo: 'QA-PROD-001', precio: 1250.5, cantidad: 0,
      categoriaId: category.id, proveedorId: provider.id,
    });
    assert.equal(response.status, 201);
    product = response.body;
    assert.equal(Number(product.cantidad), 0);
  });

  test('catálogo: consultar producto', async () => {
    const response = await request('GET', `/api/productos/${product.id}`);
    assert.equal(response.status, 200);
    assert.equal(response.body.codigo, 'QA-PROD-001');
  });

  test('catálogo: actualizar producto', async () => {
    const response = await request('PUT', `/api/productos/${product.id}`, { nombre: 'Producto QA actualizado' });
    assert.equal(response.status, 200);
    assert.equal(response.body.nombre, 'Producto QA actualizado');
  });

  test('catálogo: validar campos obligatorios', async () => {
    assert.equal((await request('POST', '/api/productos', { nombre: 'Incompleto' })).status, 400);
  });

  test('inventario: registrar entrada', async () => {
    const response = await request('POST', '/api/movimientos-inventario', {
      productoId: product.id, tipoMovimientoId: types.ENTRADA.id,
      ubicacionDestinoId: locationA.id, cantidad: 20, motivo: 'Entrada automatizada',
      referencia: 'QA-ENTRADA-1',
    });
    assert.equal(response.status, 201);
    entryMovement = response.body;
    assert.equal((await stock())[String(locationA.id)], 20);
  });

  test('inventario: rechazar cantidad negativa', async () => {
    const response = await request('POST', '/api/movimientos-inventario', {
      productoId: product.id, tipoMovimientoId: types.ENTRADA.id,
      ubicacionDestinoId: locationA.id, cantidad: -1,
    });
    assert.equal(response.status, 400);
    assert.equal((await stock())[String(locationA.id)], 20);
  });

  test('inventario: registrar salida', async () => {
    const response = await request('POST', '/api/movimientos-inventario', {
      productoId: product.id, tipoMovimientoId: types.SALIDA.id,
      ubicacionOrigenId: locationA.id, cantidad: 3, motivo: 'Salida automatizada',
    });
    assert.equal(response.status, 201);
    assert.equal((await stock())[String(locationA.id)], 17);
  });

  test('inventario: rechazar stock insuficiente', async () => {
    const response = await request('POST', '/api/movimientos-inventario', {
      productoId: product.id, tipoMovimientoId: types.SALIDA.id,
      ubicacionOrigenId: locationA.id, cantidad: 999,
    });
    assert.equal(response.status, 409);
    assert.equal((await stock())[String(locationA.id)], 17);
  });

  test('inventario: trasladar entre ubicaciones', async () => {
    const response = await request('POST', '/api/movimientos-inventario', {
      productoId: product.id, tipoMovimientoId: types.TRASLADO.id,
      ubicacionOrigenId: locationA.id, ubicacionDestinoId: locationB.id,
      cantidad: 5, motivo: 'Traslado automatizado',
    });
    assert.equal(response.status, 201);
    const quantities = await stock();
    assert.equal(quantities[String(locationA.id)], 12);
    assert.equal(quantities[String(locationB.id)], 5);
  });

  test('inventario: consistencia inicial entre existencias y producto', async () => {
    assert.equal(await assertProductTotal(), 17);
  });

  test('compras: crear compra', async () => {
    const response = await request('POST', '/api/compras', { proveedorId: provider.id });
    assert.equal(response.status, 201);
    purchase = response.body;
    assert.equal(purchase.estado, 'BORRADOR');
  });

  test('compras: agregar detalle', async () => {
    const response = await request('POST', '/api/detalles-compras', {
      compraId: purchase.id, productoId: product.id, ubicacionId: locationA.id,
      cantidad: 4, costoUnitario: 1000,
    });
    assert.equal(response.status, 201);
  });

  test('compras: confirmar e incrementar inventario', async () => {
    const response = await request('POST', `/api/compras/${purchase.id}/confirmar`, {
      claveIdempotencia: 'qa-compra-1',
    });
    assert.equal(response.status, 200);
    assert.equal(response.body.repetida, false);
    assert.equal((await stock())[String(locationA.id)], 16);
    assert.equal(await assertProductTotal(), 21);
  });

  test('compras: reintento idempotente no duplica inventario', async () => {
    const beforeStock = await stock();
    const response = await request('POST', `/api/compras/${purchase.id}/confirmar`, {
      claveIdempotencia: 'qa-compra-1',
    });
    assert.equal(response.status, 200);
    assert.equal(response.body.repetida, true);
    assert.deepEqual(await stock(), beforeStock);
  });

  test('compras: rechazar modificación confirmada', async () => {
    assert.equal((await request('PUT', `/api/compras/${purchase.id}`, { fecha: new Date().toISOString() })).status, 409);
  });

  test('ventas: crear venta y agregar detalle', async () => {
    let response = await request('POST', '/api/ventas', { clienteId: client.id });
    assert.equal(response.status, 201);
    sale = response.body;
    response = await request('POST', '/api/detalles-ventas', {
      ventaId: sale.id, productoId: product.id, ubicacionId: locationA.id,
      cantidad: 6, precioUnitario: 1600,
    });
    assert.equal(response.status, 201);
  });

  test('ventas: confirmar y disminuir inventario', async () => {
    const response = await request('POST', `/api/ventas/${sale.id}/confirmar`, {
      claveIdempotencia: 'qa-venta-1',
    });
    assert.equal(response.status, 200);
    assert.equal(response.body.repetida, false);
    assert.equal((await stock())[String(locationA.id)], 10);
    assert.equal(await assertProductTotal(), 15);
  });

  test('ventas: reintento idempotente no duplica salida', async () => {
    const beforeStock = await stock();
    const response = await request('POST', `/api/ventas/${sale.id}/confirmar`, {
      claveIdempotencia: 'qa-venta-1',
    });
    assert.equal(response.status, 200);
    assert.equal(response.body.repetida, true);
    assert.deepEqual(await stock(), beforeStock);
  });

  test('ventas: preparar venta con inventario insuficiente', async () => {
    let response = await request('POST', '/api/ventas', { clienteId: client.id });
    assert.equal(response.status, 201);
    failedSale = response.body;
    response = await request('POST', '/api/detalles-ventas', {
      ventaId: failedSale.id, productoId: product.id, ubicacionId: locationA.id,
      cantidad: 1, precioUnitario: 100,
    });
    assert.equal(response.status, 201);
    response = await request('POST', '/api/detalles-ventas', {
      ventaId: failedSale.id, productoId: product.id, ubicacionId: locationB.id,
      cantidad: 999, precioUnitario: 100,
    });
    assert.equal(response.status, 201);
  });

  test('integridad: rollback completo al fallar confirmación de venta', async () => {
    const beforeStock = await stock();
    const movementCount = await db.MovimientoInventario.count();
    const response = await request('POST', `/api/ventas/${failedSale.id}/confirmar`, {
      claveIdempotencia: 'qa-venta-fallida-1',
    });
    assert.equal(response.status, 409);
    assert.deepEqual(await stock(), beforeStock);
    assert.equal(await db.MovimientoInventario.count(), movementCount);
    const draft = await db.Venta.findByPk(failedSale.id);
    assert.equal(draft.estado, 'BORRADOR');
    assert.equal(draft.claveIdempotencia, null);
  });

  test('ajustes: ajuste positivo y registro de movimiento', async () => {
    const response = await request('POST', '/api/ajustes-inventario', {
      productoId: product.id, ubicacionId: locationB.id, cantidadNueva: 9,
      motivo: 'Conteo positivo automatizado', claveIdempotencia: 'qa-ajuste-positivo-1',
    });
    assert.equal(response.status, 201);
    assert.equal(response.body.repetida, false);
    assert.ok(response.body.ajuste.movimientoInventarioId);
    assert.equal((await stock())[String(locationB.id)], 9);
  });

  test('ajustes: reintento idempotente no duplica movimiento', async () => {
    const movementCount = await db.MovimientoInventario.count();
    const response = await request('POST', '/api/ajustes-inventario', {
      productoId: product.id, ubicacionId: locationB.id, cantidadNueva: 9,
      motivo: 'Conteo positivo automatizado', claveIdempotencia: 'qa-ajuste-positivo-1',
    });
    assert.equal(response.status, 200);
    assert.equal(response.body.repetida, true);
    assert.equal(await db.MovimientoInventario.count(), movementCount);
  });

  test('ajustes: ajuste negativo', async () => {
    const response = await request('POST', '/api/ajustes-inventario', {
      productoId: product.id, ubicacionId: locationB.id, cantidadNueva: 4,
      motivo: 'Conteo negativo automatizado', claveIdempotencia: 'qa-ajuste-negativo-1',
    });
    assert.equal(response.status, 201);
    assert.equal(Number(response.body.ajuste.diferencia), -5);
    assert.equal((await stock())[String(locationB.id)], 4);
  });

  test('integridad: total del producto coincide con existencias', async () => {
    assert.equal(await assertProductTotal(), 14);
  });

  test('integridad: movimientos aplicados son inmutables', async () => {
    let response = await request('PUT', `/api/movimientos-inventario/${entryMovement.id}`, { motivo: 'No permitido' });
    assert.equal(response.status, 409);
    response = await request('DELETE', `/api/movimientos-inventario/${entryMovement.id}`);
    assert.equal(response.status, 409);
  });

  test('integridad: escritura directa de existencias está restringida', async () => {
    const existence = await db.Existencia.findOne({
      where: { productoId: product.id, ubicacionId: locationA.id },
    });
    let response = await request('PUT', `/api/existencias/${existence.id}`, { cantidad: 999 });
    assert.equal(response.status, 403);
    response = await request('POST', '/api/existencias', {
      productoId: product.id, ubicacionId: locationA.id, cantidad: 999,
    });
    assert.equal(response.status, 403);
    assert.equal((await stock())[String(locationA.id)], 10);
  });
});

