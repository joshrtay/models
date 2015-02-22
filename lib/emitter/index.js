var Emitter = require('component-emitter');

module.exports = function(obj) {
  Emitter(obj);
  obj.emit = function(event) {
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1)
      , callbacks = this._callbacks['$' + event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        args[0] = callbacks[i].apply(this, args);
      }
    }

    return args[0];
  }
};