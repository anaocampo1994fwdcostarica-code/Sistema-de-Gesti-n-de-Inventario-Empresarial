const { ApiError } = require('../middlewares/validation');

const toCents = (value, field) => {
  if ((typeof value !== 'number' && typeof value !== 'string') || !/^\d+(\.\d{1,2})?$/.test(String(value))) {
    throw new ApiError(400, `${field} debe ser un importe no negativo con máximo dos decimales.`);
  }
  const [whole, decimal = ''] = String(value).split('.');
  const cents = Number(whole) * 100 + Number(decimal.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents > 999999999999) throw new ApiError(400, `${field} excede el máximo permitido.`);
  return cents;
};
const fromCents = (cents) => (cents / 100).toFixed(2);
const subtotal = (cantidad, unitValue, field) => {
  if (!Number.isSafeInteger(cantidad) || cantidad <= 0) throw new ApiError(400, 'cantidad debe ser un entero mayor que cero.');
  const result = toCents(unitValue, field) * cantidad;
  if (!Number.isSafeInteger(result) || result > 999999999999) throw new ApiError(400, 'El subtotal excede el máximo permitido.');
  return fromCents(result);
};
module.exports = { fromCents, subtotal, toCents };
