require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const baseConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
};

module.exports = {
  development: {
    ...baseConfig,
    database: process.env.DB_NAME || 'inventario_empresarial',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
  },
  test: {
    ...baseConfig,
    host: process.env.TEST_DB_HOST || baseConfig.host,
    port: Number(process.env.TEST_DB_PORT) || baseConfig.port,
    database: process.env.TEST_DB_NAME,
    username: process.env.TEST_DB_USER || process.env.DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || null,
    logging: false,
  },
};
