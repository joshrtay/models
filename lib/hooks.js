module.exports = function(Model) {
  Model._callbacks = {};

  Model.on = function(event, fn) {
    return this.use(function(Model) {
      (Model._callbacks['$' + event] = Model._callbacks['$' + event] || []).push(fn);
    })
  };

  Model.emit = function(event) {
    var args = [].slice.call(arguments, 1);
    var callbacks = this._callbacks['$' + event];
    if (callbacks) {
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }
  };

  Model.transform = function(event, model) {
    var args = [].slice.call(arguments, 2);
    var callbacks = this._callbacks['$' + event];
    if (callbacks) {
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        model = callbacks[i].apply(this, [model].concat(args)) || model;
      }
    }
    return model;
  };
}