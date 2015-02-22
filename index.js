module.exports = require('./lib/model')()
  .use(require('./lib/getter-setter'))
  .use(require('./lib/cast'))
  .use(require('./lib/methods'))
  .use(require('./lib/validation'))
  .use(require('./lib/required'))
  .use(require('./lib/defaults'));

require('./lib/types');