class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const assertBody = (body, allowedFields, { requireAtLeastOne = false } = {}) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ApiError(400, 'El cuerpo de la solicitud debe ser un objeto JSON.');
  }

  const fields = Object.keys(body);
  const invalidFields = fields.filter((field) => !allowedFields.includes(field));

  if (invalidFields.length) {
    throw new ApiError(400, 'La solicitud contiene campos no permitidos.', invalidFields);
  }

  if (requireAtLeastOne && fields.length === 0) {
    throw new ApiError(400, 'Debe proporcionar al menos un campo para actualizar.');
  }
};

const assertRequired = (body, fields) => {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null);
  if (missing.length) {
    throw new ApiError(400, 'Faltan campos obligatorios.', missing);
  }
};

const normalizeRequiredString = (value, field, maxLength) => {
  if (typeof value !== 'string') {
    throw new ApiError(400, `${field} debe ser una cadena de texto.`);
  }

  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw new ApiError(400, `${field} debe contener entre 1 y ${maxLength} caracteres.`);
  }

  return normalized;
};

const normalizeOptionalString = (value, field, maxLength) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value !== 'string') {
    throw new ApiError(400, `${field} debe ser una cadena de texto o null.`);
  }

  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new ApiError(400, `${field} no puede superar ${maxLength} caracteres.`);
  }

  return normalized || null;
};

const assertPositiveInteger = (value, field) => {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new ApiError(400, `${field} debe ser un entero positivo.`);
  }
  return value;
};

const validateId = (req, _res, next) => {
  const rawId = req.params.id;
  if (!/^[1-9]\d*$/.test(rawId)) {
    return next(new ApiError(400, 'El ID debe ser un entero positivo.'));
  }

  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) {
    return next(new ApiError(400, 'El ID debe ser un entero positivo.'));
  }

  req.resourceId = id;
  return next();
};

module.exports = {
  ApiError,
  assertBody,
  assertPositiveInteger,
  assertRequired,
  normalizeOptionalString,
  normalizeRequiredString,
  validateId,
};
