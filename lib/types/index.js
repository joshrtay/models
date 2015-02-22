module.exports = function(Model) {
  Model.on('configure', function(opts) {
    if('string' === typeof opts.type) {
      var name = opts.type;
      var type = this.type(name);
      if(! type) throw new Error('Unknown type "' + name + '"');
      opts.type = type;
    }
  });
  
  Model._types = {};  
  Model.type = function(name, type) {
    if(arguments.length === 2)
      this._types[name] = type;
    return this._types[name];
  };
  
  Model.use(require('./string'));
  Model.use(require('./number'));  
};