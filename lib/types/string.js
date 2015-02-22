module.exports = function(Model) {
  Model.type('string', Model()
    .validator(isString)
    .caster(toString)
    .default(''));
};

function isString(value) {
  return 'string' === typeof value;
}

function toString(value) {
  return value ? value.toString() : '';
}
