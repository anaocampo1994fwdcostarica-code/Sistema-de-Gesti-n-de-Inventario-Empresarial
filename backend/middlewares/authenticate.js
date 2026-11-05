const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { getJwtConfig } = require('../config/jwt');

const unauthorized = (res) => res.status(401).json({ error: 'No autorizado' });

module.exports = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (!authorization) return unauthorized(res);

  const match = authorization.match(/^Bearer\s+(\S+)$/);
  if (!match) return unauthorized(res);

  try {
    const jwtConfig = getJwtConfig();
    const payload = jwt.verify(match[1], jwtConfig.secret, {
      algorithms: [jwtConfig.algorithm],
    });

    if (!payload || typeof payload !== 'object' || !/^[1-9]\d*$/.test(String(payload.sub))) {
      return unauthorized(res);
    }

    const id = Number(payload.sub);
    if (!Number.isSafeInteger(id)) return unauthorized(res);

    const usuario = await Usuario.findOne({
      where: { id, activo: true },
      attributes: ['id', 'nombre', 'correo', 'activo', 'fechaCreacion'],
    });
    if (!usuario) return unauthorized(res);

    req.user = usuario;
    return next();
  } catch (_error) {
    return unauthorized(res);
  }
};
