var model = require('../model');

model
  .type('string', require('./string'))
  .type('number', require('./number'));  
