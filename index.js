module.exports = require('./lib/model')
  .use(require('./lib/cast'))
  .use(require('./lib/getter-setter'))
  .use(require('./lib/methods'))
  .use(require('./lib/validation'))
  .use(require('./lib/defaults'))
  .use(require('./lib/types'));