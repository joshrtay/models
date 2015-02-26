module.exports = function(model) {
  model.required = function(isRequired) {
    return isRequired
      ? this.validator(this._requiredValidator, 'required')
      : this.removeValidator(this._requiredValidator, 'required');
  };
  
  model._requiredValidator = model._requiredValidator || function(value, cb) {
    cb(!! value);
  };
  
  model.requiredValidator = function(fn) {
    this._requiredValidator = fn;
  };
};