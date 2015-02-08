var Type = require('./index.js');

var string = new Type();

string.addValidator(function(value) {
  return 'string' === typeof value;
});

string.addCaster(function(value) {
  return value ? value.toString() : '';
});


var number = new Type();

number.addValidator(function(value) {
  return 'number' === typeof value;
});

number.addCaster(function(value) {
  return Number(value);
});


exports.string = string;
exports.number = number;