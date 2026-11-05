const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { Usuario } = require('../models');
const { ApiError, assertBody, normalizeRequiredString } = require('../middlewares/validation');

const publicAttributes = ['id', 'nombre', 'correo', 'activo', 'fechaCreacion', 'updatedAt'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const assertOwnAccount = (req) => {
  if (req.resourceId !== req.user.id) throw new ApiError(403, 'No puede acceder a otra cuenta de usuario.');
};

const publicUser = (usuario) => {
  const data = usuario.get({ plain: true });
  return Object.fromEntries(publicAttributes.map((field) => [field, data[field]]));
};

exports.findAll = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, { attributes: publicAttributes });
    return res.status(200).json(usuario ? [usuario] : []);
  } catch (error) { return next(error); }
};

exports.findById = async (req, res, next) => {
  try {
    assertOwnAccount(req);
    const usuario = await Usuario.findByPk(req.resourceId, { attributes: publicAttributes });
    if (!usuario) throw new ApiError(404, 'Usuario no encontrado.');
    return res.status(200).json(usuario);
  } catch (error) { return next(error); }
};

exports.create = (_req, _res, next) => next(new ApiError(403, 'Utilice /api/auth/register para crear una cuenta.'));

exports.update = async (req, res, next) => {
  try {
    assertOwnAccount(req);
    assertBody(req.body, ['nombre', 'correo', 'passwordActual', 'passwordNueva'], { requireAtLeastOne: true });
    const usuario = await Usuario.findByPk(req.resourceId);
    if (!usuario || !usuario.activo) throw new ApiError(404, 'Usuario no encontrado.');

    const data = {};
    if (req.body.nombre !== undefined) data.nombre = normalizeRequiredString(req.body.nombre, 'nombre', 100);
    if (req.body.correo !== undefined) {
      data.correo = normalizeRequiredString(req.body.correo, 'correo', 150).toLowerCase();
      if (!emailPattern.test(data.correo)) throw new ApiError(400, 'correo debe tener un formato válido.');
      if (await Usuario.findOne({ where: { correo: data.correo, id: { [Op.ne]: usuario.id } }, attributes: ['id'] })) {
        throw new ApiError(409, 'Ya existe un usuario con ese correo.');
      }
    }
    const changingPassword = req.body.passwordActual !== undefined || req.body.passwordNueva !== undefined;
    if (changingPassword) {
      if (typeof req.body.passwordActual !== 'string' || typeof req.body.passwordNueva !== 'string') {
        throw new ApiError(400, 'Debe proporcionar la contraseña actual y la nueva contraseña.');
      }
      if (!await bcrypt.compare(req.body.passwordActual, usuario.passwordHash)) {
        throw new ApiError(401, 'La contraseña actual es incorrecta.');
      }
      if (req.body.passwordNueva.length < 8 || Buffer.byteLength(req.body.passwordNueva, 'utf8') > 72) {
        throw new ApiError(400, 'La nueva contraseña debe contener entre 8 caracteres y 72 bytes.');
      }
      data.passwordHash = await bcrypt.hash(req.body.passwordNueva, 12);
    }
    await usuario.update(data);
    return res.status(200).json(publicUser(usuario));
  } catch (error) { return next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    assertOwnAccount(req);
    const usuario = await Usuario.findByPk(req.resourceId);
    if (!usuario || !usuario.activo) throw new ApiError(404, 'Usuario no encontrado.');
    await usuario.update({ activo: false });
    return res.status(200).json({ message: 'Cuenta desactivada correctamente.' });
  } catch (error) { return next(error); }
};
