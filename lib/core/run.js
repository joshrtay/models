var ware = require('ware');
var slice = [].slice;

module.exports = function(Model) {

  var emit = Model.prototype.emit;
  Model.prototype.emit = function() {
    var args = slice.call(arguments);
    emit.apply(this, args);

    args.splice(1, 0, this);
    this.model.emit.apply(this.model, args);
  }

  /**
   * Run through the middleware with the given `args` and optional `callback`.
   *
   * @param {Mixed} args...
   * @param {Function} callback (optional)
   * @return {Ware}
   */

  Model.prototype.run = function (ev) {
    var self = this;

    var startEvent = ev;
    var endEvent = null;
    if (_.isObject(ev)) {
      startEvent = ev.start;
      endEvent = ev.end;
    }

    var last = arguments[arguments.length - 2];
    var done = arguments[arguments.length - 1];
    if ('function' !== typeof last) {
      last = done;
      done = null;
    }

    var fns = this.model.listeners(ev).slice(0)
      .concat(this.listeners(ev).slice(0))
      .concat(last);

    var args = done
      ? slice.call(arguments, 1, arguments.length - 2)
      : slice.call(arguments, 1, arguemnts.length - 1);

    var i = 0;

    // next step
    function next (err) {
      if (err) return done(err);
      var fn = fns[i++];
      var arr = slice.call(args);

      if (!fn) {
        done && done.apply(null, [null].concat(args));
        endEvent && self.emit.apply(self, [endEvent].concat(args));
        return;
      }

      wrap(fn, next).apply(ctx, arr);
    }

    next();

    return this;
  };

}