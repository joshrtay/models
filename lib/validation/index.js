module.exports = function(Model, Document) {
  Model.on('init', function(model) {
    model.validators = [];
    
    model.on('extend', function(extender) {
      model.validators.forEach(function(validator) {
        extender.addValidator(validator[0], validator[1]);
      });
      
      extender.requiredValidator = requiredValidator;
    });
  });
  
  Model.prototype.addValidator = function(fn, key) {
    this.validators.push([fn, key]);
  };
  
  Model.prototype.validate = function(doc, cb) {
    var attrs = this.attrs;
    var keys = Object.keys(attrs);
    var n = keys.length;
    var errors = [];
    // Run our own validators first (a model may have 
    // validators on its root that validate relations
    // between elements of the model)
    
    this._validateSelf(doc, function(err) {
      if(err) return cb(err);
      keys.forEach(function(path) {
        var type = attrs[path];
        var value = doc.get(path);
        type.validate(value, function(err) {
          n--;
          if(err) errors.push(err);
          if(n === 0) cb(errors.length ? errors : null);
        });
      });
    });
  };
  
  Model.prototype._validateSelf = function(doc, cb) {
    var mw = ware();

    this.validators.forEach(function(validator) {
      mw.use(function(value, next) {
        var fn = validator[0];
        fn.length === 1
          ? handle(fn(value))
          : fn(value, handle);
          
        function handle(valid) {
          setTimeout(function() {
            if(valid === false) {
              var err = new Error();
              err.key = validator[1];
              return next(err);
            }
            
            next(null, value);
          });
        }
      });
    });

    mw.run(value, cb);
  };
  
  Model.prototype.requiredValidator = function(value, cb) {
    cb(!! value);
  };
  
  Document.prototype.validate = function(cb) {
    this.model.validate(doc, cb);
  };
};