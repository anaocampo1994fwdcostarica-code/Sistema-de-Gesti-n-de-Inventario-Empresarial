const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');
const { Usuario } = require('../models');
const { getJwtConfig } = require('../config/jwt');
const {
  ApiError,
  assertBody,
  assertRequired,
  normalizeRequiredString,
} = require('../middlewares/validation');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const saltRounds = 12;

const normalizeEmail = (value) => {
  const correo = normalizeRequiredString(value, 'correo', 150).toLowerCase();
  if (!emailPattern.test(correo)) {
    throw new ApiError(400, 'correo debe tener un formato válido.');
  }
  return correo;
};

const validatePassword = (value) => {
  if (typeof value !== 'string' || value.length < 8) {
    throw new ApiError(400, 'password debe contener al menos 8 caracteres.');
  }
  if (Buffer.byteLength(value, 'utf8') > 72) {
    throw new ApiError(400, 'password no puede superar 72 bytes.');
  }
  return value;
};

const serializeUser = (usuario) => {
  const plain = usuario.get({ plain: true });
  return {
    id: plain.id,
    nombre: plain.nombre,
    correo: plain.correo,
    activo: plain.activo,
    fechaCreacion: plain.fechaCreacion,
  };
};

exports.register = async (req, res, next) => {
  try {
    assertBody(req.body, ['nombre', 'correo', 'password']);
    assertRequired(req.body, ['nombre', 'correo', 'password']);

    const nombre = normalizeRequiredString(req.body.nombre, 'nombre', 100);
    const correo = normalizeEmail(req.body.correo);
    const password = validatePassword(req.body.password);

    if (await Usuario.findOne({ where: { correo }, attributes: ['id'] })) {
      throw new ApiError(400, 'Ya existe un usuario con ese correo.');
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const usuario = await Usuario.create({ nombre, correo, passwordHash });
    return res.status(201).json(serializeUser(usuario));
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return next(new ApiError(400, 'Ya existe un usuario con ese correo.'));
    }
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    assertBody(req.body, ['correo', 'password']);
    assertRequired(req.body, ['correo', 'password']);

    const correo = normalizeEmail(req.body.correo);
    if (typeof req.body.password !== 'string' || req.body.password.length === 0) {
      throw new ApiError(400, 'password debe ser una cadena de texto no vacía.');
    }
    const password = req.body.password;
    const usuario = await Usuario.findOne({ where: { correo, activo: true } });
    const validPassword = usuario
      ? await bcrypt.compare(password, usuario.passwordHash)
      : false;

    if (!usuario || !validPassword) {
      throw new ApiError(401, 'Credenciales incorrectas.');
    }

    const jwtConfig = getJwtConfig();
    const token = jwt.sign(
      { sub: String(usuario.id) },
      jwtConfig.secret,
      { algorithm: jwtConfig.algorithm, expiresIn: jwtConfig.expiresIn },
    );

    return res.status(200).json({ token, usuario: serializeUser(usuario) });
  } catch (error) {
    return next(error);
  }
};

exports.me = async (req, res) => res.status(200).json(serializeUser(req.user));
