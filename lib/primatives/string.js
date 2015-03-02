require('../../')
  .validator(isString, 'string')
  .default('')
  .type('string');

function isString(value) {
  return 'string' === typeof value;
}

function toString(value) {
  return value ? value.toString() : '';
}
