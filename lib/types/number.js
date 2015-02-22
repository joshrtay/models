var model = require('../model');

module.exports = model()
  .validator(isNumber)
  .caster(toNumber)
  .default(0);

function isNumber(value) {
  return 'number' === typeof value;
}

function toNumber(value) {
  return Number(value);
}
