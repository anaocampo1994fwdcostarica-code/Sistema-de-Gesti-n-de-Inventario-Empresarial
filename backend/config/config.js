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
};
