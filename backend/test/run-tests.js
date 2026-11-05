'use strict';

const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const dotenv = require('dotenv');

const backendRoot = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(backendRoot, '.env') });
dotenv.config({ path: path.join(backendRoot, '.env.test'), override: true });

process.env.NODE_ENV = 'test';
process.env.TEST_DB_HOST ||= process.env.DB_HOST || '127.0.0.1';
process.env.TEST_DB_PORT ||= process.env.DB_PORT || '3306';
process.env.TEST_DB_USER ||= process.env.DB_USER || 'root';
process.env.TEST_DB_PASSWORD ||= process.env.DB_PASSWORD || '';
process.env.JWT_SECRET = randomBytes(48).toString('base64url');
process.env.JWT_EXPIRES_IN = '1h';
process.env.TEST_USER_PASSWORD = `Qa-${randomBytes(18).toString('base64url')}!`;

const testDatabase = process.env.TEST_DB_NAME;
const mainDatabase = process.env.DB_NAME || 'inventario_empresarial';
const safeName = typeof testDatabase === 'string' && /^[A-Za-z0-9_]+_test$/.test(testDatabase);

if (!safeName || testDatabase === mainDatabase || testDatabase === 'inventario_empresarial') {
  console.error('Pruebas detenidas: configure TEST_DB_NAME con una base exclusiva cuyo nombre termine en _test.');
  process.exit(2);
}

console.log(`Base aislada verificada: ${testDatabase}`);
const result = spawnSync(process.execPath, ['--test', '--test-concurrency=1', 'test/integration.test.js'], {
  cwd: backendRoot,
  env: process.env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
