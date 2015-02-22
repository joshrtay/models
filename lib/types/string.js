var model = require('../model');

module.exports = model()
  .validator(isString, 'string')
  .caster(toString)
  .default('');

function isString(value) {
  return 'string' === typeof value;
}

function toString(value) {
  return value ? value.toString() : '';
}
