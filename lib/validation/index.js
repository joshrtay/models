/**
 * Module dependencies
 */

var noop = function(){};

module.exports = function(Model) {

  /**
  * Add validation `fn()`.
  *
  * @param {Function} fn
  * @return {Function} self
  * @api public
  */

  Model.validate = function(fn){
    return this.on('validating', fn);
  };

  /**
  * Perform validations.
  *
  * @api private
  */

  Model.prototype.validate = function(fn) {
    fn = fn || noop;
    var self = this;

    this.run('validating', [], function(errors, done) {
      if (errors.length) {
        var err = new Error('validation failed');
        err.errors = errors;
        done(err);
      } else
        done(null);
    }, fn);
  };

}