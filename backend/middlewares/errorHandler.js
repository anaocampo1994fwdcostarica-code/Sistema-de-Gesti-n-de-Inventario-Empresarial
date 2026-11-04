const {
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} = require('sequelize');
const { ApiError } = require('./validation');

module.exports = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    const response = { error: error.message };
    if (error.details) response.details = error.details;
    return res.status(error.status).json(response);
  }

  if (error instanceof UniqueConstraintError) {
    return res.status(409).json({ error: 'Ya existe un registro con un valor único igual.' });
  }

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(409).json({ error: 'La operación entra en conflicto con registros relacionados.' });
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: 'Los datos proporcionados no son válidos.',
      details: error.errors.map((item) => item.message),
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'El cuerpo JSON no es válido.' });
  }

  console.error(error);
  return res.status(500).json({ error: 'Error interno del servidor.' });
};
