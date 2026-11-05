const getJwtConfig = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('Configuración JWT inválida: JWT_SECRET debe contener al menos 32 bytes.');
  }

  return {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    secret,
  };
};

const assertJwtConfig = () => {
  getJwtConfig();
};

module.exports = { assertJwtConfig, getJwtConfig };
