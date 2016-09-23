(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Gator = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.config = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var priorityDefault = exports.priorityDefault = 30;

  var appPrefix = exports.appPrefix = 'gt';

  var fieldQuery = exports.fieldQuery = {
    prefix: '^' + appPrefix,
    input: 'input:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
    select: ',select[required]:not(:disabled):not([readonly])',
    textarea: ',textarea[required]:not(:disabled):not([readonly])',
    messages: '[' + appPrefix + '-messages]',
    message: '[' + appPrefix + '-message]'
  };

  var attributes = exports.attributes = {
    prefix: appPrefix + '-',
    messages: appPrefix + '-messages',
    message: appPrefix + '-message'
  };

  var ruleTypes = exports.ruleTypes = {
    email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    integer: /^-?\d+$/,
    digits: /\d+$/,
    alphanum: /^\w+$/i,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
  };

  var rules = exports.rules = {
    required: {
      fn: function fn(value) {
        return (/\S/.test(value)
        );
      },
      priority: 1024,
      handshake: false
    },
    type: {
      fn: function fn(value) {
        var regex = ruleTypes[this.params[0]];
        return regex.test(value);
      },
      priority: 256,
      handshake: false
    },
    minlength: {
      fn: function fn(value) {
        return value.length >= this.params[0];
      },
      priority: 512,
      handshake: false
    },
    maxlength: {
      fn: function fn(value) {
        return value.length <= this.params[0];
      },
      priority: 512,
      handshake: false
    },
    handshake: {
      fn: function fn(fields, success, error) {
        console.log('Inside handshake');
        error();
      },
      priority: 0,
      handshake: true
    },
    all: {
      fn: function fn(fields, success, error) {
        for (var field in fields) {
          if (!fields[field].value) {
            error();
            return;
          }
        }
        success();
      },
      priority: 0,
      handshake: true
    },
    one: {
      fn: function fn(fields, success, error) {
        for (var field in fields) {
          if (fields[field].value) {
            success();
            return;
          }
        }
        error();
      },
      priority: 0,
      handshake: true
    },
    same: {
      fn: function fn(fields, success, error) {
        var ref = fields[Object.keys(fields)[0]];
        for (var field in fields) {
          if (fields[field].value !== ref.value) {
            error();
            return;
          }
        }
        success();
      },
      priority: 0,
      handshake: true
    },
    groupAll: {
      fn: function fn(fields) {
        for (var _iterator = fields, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var field = _ref;

          if (!field.value) {
            return false;
          }
        }
        return true;
      },
      priority: 0,
      handshake: true
    },
    custom: {
      fn: function fn(fields, success, error, ignore) {
        if (fields.email.isEmail()) {
          success();
        } else {
          error();
        }
      },
      priority: 0,
      handshake: true,
      required: false
    },
    custom2: {
      fn: function fn(fields, success, error, ignore, ajax) {},
      priority: 0,
      handshake: true,
      required: false
    }
  };

  // Simple version of an Enums
  var fieldState = exports.fieldState = {
    INIT: 0,
    WAIT: 1,
    SUCCESS: 2,
    ERROR: 4,
    HANDSHAKE: 5
  };

  // Simple version of an Enums
  var validatorState = exports.validatorState = {
    INIT: 0,
    SUCCESS: 1,
    ERROR: 2,
    HANDSHAKE: 3
  };

  var objType = exports.objType = {
    FIELD: 0,
    FORM: 1,
    MESSAGE: 2
  };
});

},{}],2:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["module", "./config.js", "./utils.js", "./validator"], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require("./config.js"), require("./utils.js"), require("./validator"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.config, global.utils, global.validator);
        global.formField = mod.exports;
    }
})(this, function (module, _config, _utils, _validator2) {
    "use strict";

    var _validator3 = _interopRequireDefault(_validator2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var FormField = function () {
        function FormField(fieldElem, formName) {
            _classCallCheck(this, FormField);

            this.uniqueId = (0, _utils.getUniqueId)();
            this.objType = _config.objType.FIELD;
            this.fieldState = _config.fieldState.INIT;
            this._fieldElem = fieldElem;
            this.fieldName = fieldElem.getAttribute("name");
            this.fieldValue = this._fieldElem.value;
            this.fieldValidator = null;
            this.formName = formName;
            this._validators = [];
            this.onInit();
        }

        FormField.prototype.onInit = function onInit() {
            this.registerValidators();
            this.prioritizeValidators();
            this.subscribe();
            this.listener();
        };

        FormField.prototype.subscribe = function subscribe() {
            this.subCBSuccess = _utils.pubSub.subscribe('field:callbackSuccess', this.callbackSuccess.bind(this));
            this.subCBError = _utils.pubSub.subscribe('field:callbackError', this.callbackError.bind(this));
            this.subCBIgnore = _utils.pubSub.subscribe('field:callbackIgnore', this.callbackIgnore.bind(this));
        };

        FormField.prototype.callbackSuccess = function callbackSuccess(obj) {

            if (this.uniqueId === obj.uniqueId) {
                this.clearError();
                this.enable();
            }
        };

        FormField.prototype.callbackError = function callbackError(obj) {

            if (this.uniqueId === obj.uniqueId) {
                this.enable();
                this.showError(obj.key);
                this.fieldState = _config.validatorState.ERROR;
            }
        };

        FormField.prototype.callbackIgnore = function callbackIgnore(obj) {

            if (this.uniqueId === obj.uniqueId) {
                this.enable();
            }
        };

        FormField.prototype.listener = function listener() {
            this._fieldElem.addEventListener('keyup', this.validate.bind(this), false);
        };

        FormField.prototype.disable = function disable() {
            this._fieldElem.disabled = true;
        };

        FormField.prototype.enable = function enable() {
            this._fieldElem.disabled = false;
        };

        FormField.prototype.validate = function validate() {

            this.fieldValue = this._fieldElem.value;
            this.fieldState = _config.fieldState.WAIT;
            for (var _iterator = this._validators, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                var _ref;

                if (_isArray) {
                    if (_i >= _iterator.length) break;
                    _ref = _iterator[_i++];
                } else {
                    _i = _iterator.next();
                    if (_i.done) break;
                    _ref = _i.value;
                }

                var _validator = _ref;

                _validator.validate(this.fieldValue);
                if (_validator.state === _config.validatorState.ERROR) {
                    this.showError(_validator.key);
                    this.fieldState = _config.fieldState.ERROR;
                    return;
                } else if (_validator.state === _config.validatorState.HANDSHAKE) {
                    this.disable();
                    this.clearError();
                    this.fieldState = _config.fieldState.HANDSHAKE;
                    _utils.pubSub.publish('handshake:execute', {
                        key: _validator.key,
                        fieldName: this.fieldName,
                        fieldValue: this.fieldValue,
                        uniqueId: self.uniqueId
                    });
                    return;
                }
            }
            this.fieldValidator = validator;
            this.fieldState = _config.fieldState.SUCCESS;
            this.clearError();
        };

        FormField.prototype.registerValidators = function registerValidators() {
            var _this = this;

            var self = this,
                attribute = null,
                regex = new RegExp(_config.fieldQuery.prefix, 'i');

            (0, _utils.nl2arr)(this._fieldElem.attributes).forEach(function (attr) {
                if (attr.name && regex.test(attr.name) && attr.specified) {
                    attribute = attr.name.slice(_config.attributes.prefix.length);
                } else if (attr.name === 'required' && attr.specified) {
                    attribute = 'required';
                } else {
                    attribute = null;
                }

                if (attribute) {
                    self._validators.push(new _validator3.default(attribute, attr.value, _this.fieldName, _this.uniqueId));
                }
            });
        };

        FormField.prototype.prioritizeValidators = function prioritizeValidators() {
            if (this._validators.length) {
                this._validators.sort(function (a, b) {
                    return b.priority - a.priority;
                });
            }
        };

        FormField.prototype.showError = function showError(key) {
            _utils.pubSub.publish('messages:show', {
                fieldName: this.fieldName,
                formName: this.formName,
                key: key
            });
        };

        FormField.prototype.clearError = function clearError() {
            _utils.pubSub.publish('messages:clear', {
                fieldName: this.fieldName,
                formName: this.formName
            });
        };

        FormField.prototype.destroy = function destroy() {
            this._fieldElem.removeEventListener('keyup', this.validate.bind(this), false);
            this.subCBSuccess.remove();
            this.subCBError.remove();
            this._fieldElem = null;
            this._validators.length = 0;
        };

        return FormField;
    }();

    module.exports = FormField;
});

},{"./config.js":1,"./utils.js":7,"./validator":8}],3:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './form-field', './messages', './utils.js', './config.js'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./form-field'), require('./messages'), require('./utils.js'), require('./config.js'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.formField, global.messages, global.utils, global.config);
        global.form = mod.exports;
    }
})(this, function (module, _formField, _messages, _utils, _config) {
    'use strict';

    var _formField2 = _interopRequireDefault(_formField);

    var _messages2 = _interopRequireDefault(_messages);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Form = function () {
        function Form(elem) {
            _classCallCheck(this, Form);

            this.elem = elem;
            this.fields = [];
            this.messages = [];
            this.name = this.elem.getAttribute("name");
            this.onInit();
        }

        Form.prototype.onInit = function onInit() {
            this.registerFormFields();
            this.registerMessages();
        };

        Form.prototype.registerFormFields = function registerFormFields() {
            var _this = this;

            var self = this;
            (0, _utils.nl2arr)(this.elem.querySelectorAll(_config.fieldQuery.input + _config.fieldQuery.select + _config.fieldQuery.textarea)).forEach(function (elem) {
                _this.fields.push(new _formField2.default(elem, _this.name));
            });
        };

        Form.prototype.registerMessages = function registerMessages() {
            var _this2 = this;

            var self = this;
            (0, _utils.nl2arr)(this.elem.querySelectorAll(_config.fieldQuery.messages)).forEach(function (elem) {
                _this2.messages.push(new _messages2.default(elem));
            });
        };

        Form.prototype.destroy = function destroy() {
            this.elem = null;
            this.fields.length = 0;
        };

        return Form;
    }();

    module.exports = Form;
});

},{"./config.js":1,"./form-field":2,"./messages":6,"./utils.js":7}],4:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './form', './handshake'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./form'), require('./handshake'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.form, global.handshake);
        global.gator = mod.exports;
    }
})(this, function (module, _form, _handshake) {
    'use strict';

    var _form2 = _interopRequireDefault(_form);

    var _handshake2 = _interopRequireDefault(_handshake);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Gator = function () {
        function Gator() {
            _classCallCheck(this, Gator);

            var elem = document.getElementById('customerForm');
            var handshake = _handshake2.default;
            var elemForm = new _form2.default(elem);

            this.handShakes = {};
        }

        Gator.prototype.handshake = function handshake(topic, fn) {
            this.handShakes[topic] = fn;
            return this;
        };

        return Gator;
    }();

    module.exports = Gator;
});

},{"./form":3,"./handshake":5}],5:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["module", "./utils", "./form-field", "./config.js"], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require("./utils"), require("./form-field"), require("./config.js"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.utils, global.formField, global.config);
        global.handshake = mod.exports;
    }
})(this, function (module, _utils, _formField, _config) {
    "use strict";

    var _formField2 = _interopRequireDefault(_formField);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var field = function () {
        function field(uniqueId) {
            _classCallCheck(this, field);

            this.uniqueId = uniqueId;
            this.value = null;
            this.ready = false;
        }

        field.prototype.isType = function isType(type) {
            return _config.rules.type.fn.call({ params: [type] }, this.value);
        };

        return field;
    }();

    var Handshake = function () {
        function Handshake() {
            _classCallCheck(this, Handshake);

            this._handshakes = {};
            this.init();
            window.hs = this._handshakes;
        }

        Handshake.prototype.init = function init() {
            this.subscribe();
        };

        Handshake.prototype.subscribe = function subscribe() {
            this.subRegister = _utils.pubSub.subscribe('handshake:register', this.register.bind(this));
            this.subExecute = _utils.pubSub.subscribe('handshake:addField', this.addField.bind(this));
            this.subExecute = _utils.pubSub.subscribe('handshake:execute', this.execute.bind(this));
            this.subReset = _utils.pubSub.subscribe('handshake:reset', this.reset.bind(this));
        };

        Handshake.prototype.register = function register(obj) {
            if (!this._handshakes.hasOwnProperty(obj.key)) {
                this._handshakes[obj.key] = {
                    fields: {},
                    key: obj.key
                };
            }
        };

        Handshake.prototype.addField = function addField(obj) {
            this.register(obj);
            this._handshakes[obj.key].fields[obj.fieldName] = new field(obj.uniqueId);
        };

        Handshake.prototype.setFieldReady = function setFieldReady(key, fieldName, value) {
            var field = this._handshakes[key].fields[fieldName];
            field.value = value;
            field.ready = true;
        };

        Handshake.prototype.fieldsReady = function fieldsReady(key) {
            var fields = this._handshakes[key].fields;
            for (var _field in fields) {
                if (fields.hasOwnProperty(_field)) {
                    if (!fields[_field].ready) {
                        return false;
                    }
                }
            }
            return true;
        };

        Handshake.prototype.execute = function execute(obj) {
            // Update Field
            this.setFieldReady(obj.key, obj.fieldName, obj.fieldValue);
            // Are all fields in handshake mode?
            if (this.fieldsReady(obj.key) || !_config.rules[obj.key].required) {
                // Execute Function
                _config.rules[obj.key].fn(this._handshakes[obj.key].fields, this.callback.bind(this._handshakes[obj.key], 'field:callbackSuccess'), this.callback.bind(this._handshakes[obj.key], 'field:callbackError'), this.callback.bind(this._handshakes[obj.key], 'field:callbackIgnore'));
            }
        };

        Handshake.prototype.callback = function callback(event) {
            for (var _field2 in this.fields) {
                if (this.fields.hasOwnProperty(_field2)) {
                    _utils.pubSub.publish(event, {
                        uniqueId: this.fields[_field2].uniqueId,
                        key: this.key
                    });
                }
            }
        };

        Handshake.prototype.reset = function reset() {};

        Handshake.prototype.destroy = function destroy() {
            this.subRegister.remove();
            this.subExecute.remove();
            this.subExecute.remove();
            this.subReset.remove();
        };

        return Handshake;
    }();

    module.exports = new Handshake();
});

},{"./config.js":1,"./form-field":2,"./utils":7}],6:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["module", "./utils.js", "./config.js"], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require("./utils.js"), require("./config.js"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.utils, global.config);
        global.messages = mod.exports;
    }
})(this, function (module, _utils, _config) {
    "use strict";

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Messages = function () {
        function Messages(msgsElem) {
            _classCallCheck(this, Messages);

            this._msgsElem = msgsElem;
            this._messages = {};
            this.formName = null;
            this.fieldName = null;
            this.onInit();
        }

        Messages.prototype.onInit = function onInit() {
            var attrs = this._msgsElem.getAttribute(_config.attributes.messages).split('.');
            this.formName = attrs[0];
            this.fieldName = attrs[1];

            this.register();
            this.hideAll();
            this.subscribe();
        };

        Messages.prototype.subscribe = function subscribe() {
            var self = this;
            this.subShow = _utils.pubSub.subscribe('messages:show', function (obj) {
                if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                    self.hideAll();
                    self.show(obj.key);
                }
            });

            this.subClear = _utils.pubSub.subscribe('messages:clear', function (obj) {
                if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                    self.hideAll();
                }
            });

            this.subDestroy = _utils.pubSub.subscribe('messages:destroy', function (obj) {
                self.destroy();
            });
        };

        Messages.prototype.register = function register() {
            var self = this;
            (0, _utils.nl2arr)(this._msgsElem.querySelectorAll(_config.fieldQuery.message)).forEach(function (msgElem) {
                var key = msgElem.getAttribute(_config.attributes.message);
                if (key) {
                    self._messages[key] = msgElem;
                }
            });
        };

        Messages.prototype.show = function show(key) {
            this.validateKey(key);
            this._messages[key].style.display = 'block';
        };

        Messages.prototype.hideAll = function hideAll() {
            var messages = this._messages;
            for (var key in messages) {
                this.validateKey(key);
                messages[key].style.display = 'none';
            }
        };

        Messages.prototype.validateKey = function validateKey(key) {
            if (!this._messages.hasOwnProperty(key)) {
                throw new Error("Missing \"gt-" + key + " in gt-messages=\"" + this.formName + "." + this.fieldName + "\"");
            }
        };

        Messages.prototype.destroy = function destroy() {
            this._elem = null;
            this._messages.length = 0;
            this.subShow.remove();
            this.subClear.remove();
            this.subDestroy.remove();
        };

        return Messages;
    }();

    module.exports = Messages;
});

},{"./config.js":1,"./utils.js":7}],7:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.utils = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.nl2arr = nl2arr;
  exports.getUniqueId = getUniqueId;
  exports.isString = isString;
  exports.isObject = isObject;
  exports.isArray = isArray;
  function nl2arr(nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  // https://davidwalsh.name/pubsub-javascript
  var pubSub = exports.pubSub = function () {

    var topics = {};
    var hOP = topics.hasOwnProperty;

    return {
      subscribe: function subscribe(topic, listener) {
        // Create the topic's object if not yet created
        if (!hOP.call(topics, topic)) topics[topic] = [];

        // Add the listener to queue
        var index = topics[topic].push(listener) - 1;

        // Provide handle back for removal of topic
        return {
          remove: function remove() {
            delete topics[topic][index];
          }
        };
      },
      publish: function publish(topic, info) {
        // If the topic doesn't exist, or there's no listeners in queue, just leave
        if (!hOP.call(topics, topic)) return;

        // Cycle through topics queue, fire!
        topics[topic].forEach(function (item) {
          item(info != undefined ? info : {});
        });
      }
    };
  }();

  function getUniqueId() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  function isString(str) {}

  function isObject(obj) {}

  function isArray(arr) {}
});

},{}],8:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './config', './utils'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./config'), require('./utils'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.config, global.utils);
        global.validator = mod.exports;
    }
})(this, function (module, _config, _utils) {
    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Validator = function () {
        function Validator(key, params, fieldName, fieldUniqueId) {
            _classCallCheck(this, Validator);

            this.key = key;
            this.fieldName = fieldName;
            this.fieldUniqueId = fieldUniqueId;
            this.state = _config.validatorState.INIT;
            this.params = params.length ? params.split(',') : [];
            this.onInit();
        }

        Validator.prototype.onInit = function onInit() {
            this.setPriority();
            this.setHandshake();
        };

        Validator.prototype.setPriority = function setPriority() {
            if (!_config.rules.hasOwnProperty(this.key)) {
                throw new Error('Invalid directive, "gt-' + this.key + '"');
            }
            this.priority = _config.rules[this.key].priority;
        };

        Validator.prototype.setHandshake = function setHandshake() {
            var self = this;
            if (_config.rules[this.key].handshake) {
                _utils.pubSub.publish('handshake:addField', {
                    key: self.key,
                    fieldName: self.fieldName,
                    uniqueId: self.fieldUniqueId
                });
            }
        };

        Validator.prototype.validate = function validate(value) {
            var self = this,
                rule = _config.rules[this.key];
            if (rule.handshake === true) {
                this.state = _config.validatorState.HANDSHAKE;
            } else {
                this.state = rule.fn.call(this, value) ? _config.validatorState.SUCCESS : _config.validatorState.ERROR;
            }
        };

        Validator.prototype.destroy = function destroy() {
            this.params.length = 0;
        };

        return Validator;
    }();

    module.exports = Validator;
});

},{"./config":1,"./utils":7}]},{},[4])(4)
});