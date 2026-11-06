'use strict';

const path = require('node:path');
const { randomBytes } = require('node:crypto');
const dotenv = require('dotenv');

const backendRoot = path.resolve(__dirname, '..');
const expectedDatabase = 'inventario_empresarial_test';
const expectedPort = 3104;

dotenv.config({ path: path.join(backendRoot, '.env') });

if (process.env.TEST_DB_NAME && process.env.TEST_DB_NAME !== expectedDatabase) {
  throw new Error('Inicio bloqueado: TEST_DB_NAME no coincide con la base permitida.');
}

process.env.NODE_ENV = 'test';
process.env.TEST_DB_NAME = expectedDatabase;
process.env.TEST_DB_HOST ||= process.env.DB_HOST || '127.0.0.1';
process.env.TEST_DB_PORT ||= process.env.DB_PORT || '3306';
process.env.TEST_DB_USER ||= process.env.DB_USER || 'root';
process.env.TEST_DB_PASSWORD ||= process.env.DB_PASSWORD || '';
process.env.PORT = String(expectedPort);
process.env.JWT_SECRET = randomBytes(48).toString('base64url');
process.env.JWT_EXPIRES_IN = '1h';

if (process.env.NODE_ENV !== 'test' || process.env.TEST_DB_NAME !== expectedDatabase) {
  throw new Error('Inicio bloqueado: entorno de pruebas inválido.');
}
if (process.env.DB_NAME === expectedDatabase) {
  throw new Error('Inicio bloqueado: la base principal y la de pruebas no pueden coincidir.');
}

const { QueryTypes } = require('sequelize');
const db = require('../models');
const app = require('../app');

let server;

const close = async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await db.sequelize.close();
};

(async () => {
  await db.sequelize.authenticate();
  const rows = await db.sequelize.query('SELECT DATABASE() AS activeDatabase', {
    type: QueryTypes.SELECT,
  });
  const activeDatabase = rows[0]?.activeDatabase;

  if (activeDatabase !== expectedDatabase) {
    await db.sequelize.close();
    throw new Error('Inicio bloqueado: Sequelize no está conectado a la base permitida.');
  }

  server = app.listen(expectedPort, '127.0.0.1', () => {
    console.log(JSON.stringify({
      event: 'POSTMAN_TEST_READY',
      pid: process.pid,
      port: expectedPort,
      nodeEnv: process.env.NODE_ENV,
      database: activeDatabase,
    }));
  });
})();

process.on('SIGINT', () => close().finally(() => process.exit(0)));
process.on('SIGTERM', () => close().finally(() => process.exit(0)));
