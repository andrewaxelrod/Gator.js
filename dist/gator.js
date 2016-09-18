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
    input: 'input[required]:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
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
      priority: 1024
    },
    remote: {
      fn: function fn(value) {},
      priority: -100
    },
    type: {
      fn: function fn(value) {
        var regex = ruleTypes[this.params[0]];
        return regex.test(value);
      },
      priority: 256
    },
    minlength: {
      fn: function fn(value) {
        return value.length >= this.params[0];
      },
      priority: 512
    },
    maxlength: {
      fn: function fn(value) {
        return value.length <= this.params[0];
      },
      priority: 512
    },
    handshake: {
      fn: function fn(value) {},
      priority: 0
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

  var objType = exports.objType = {
    FIELD: 0,
    FORM: 1,
    MESSAGE: 2
  };
});

},{}],2:[function(require,module,exports){
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
        global.coordinator = mod.exports;
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

    var Coordinator = function () {
        function Coordinator() {
            _classCallCheck(this, Coordinator);

            this.onInit();
            this.handShakes = {};
        }

        Coordinator.prototype.onInit = function onInit() {
            this.subscribe();
        };

        Coordinator.prototype.subscribe = function subscribe() {
            var _this = this;

            var self = this;
            this.subCoordinate = _utils.pubSub.subscribe('coordinate', function (obj) {
                if (obj.objType === _config.objType.FIELD) {
                    _this.funnelField(obj);
                }
            });
        };

        Coordinator.prototype.funnelField = function funnelField(field) {

            // Check the state of the field
            if (field.state === _config.fieldState.SUCCESS || field.state === _config.fieldState.ERROR) {
                console.log(field.fieldName + ' is already validated.');
                return;
            } else if (field.state === _config.fieldState.HANDSHAKE) {
                console.log(field.fieldName + ' is in handshake mode.');
                //  this.addHandShake(field);
            } else {
                console.log(field.fieldName + ' is in going to be validated.');
                _utils.pubSub.publish('field:validate', field.uniqueId);
            }

            /*
            
                        if (ob.state === fieldState.HANDSHAKE) {
                            if(!this.handShakes.hasOwnProperty(obj.validation)) {
                                this.handShakes[obj.validation] = {};
                            }
                            this.handShakes[obj.validation][obj.fieldName] = obj.fieldValue;
                        }
            
                        if (obj.objType === objType.FIELD) {
                            pubSub.publish('field:validate', obj.uniqueId); 
                        }
            
                        this.handShakes = null;
            
                        */
        };

        Coordinator.prototype.validateFields = function validateFields() {
            // Could send an obj, but the you are ending the same object back to the object. 
            // This may cause a ciruclar reference. 
            //
            // You could also do an obj.validate(), which would break the pub/sub.
            _utils.pubSub.publish('field:validate', uniqueId);
        };

        Coordinator.prototype.destroy = function destroy() {
            this.subCoordinate.remove();
        };

        return Coordinator;
    }();

    module.exports = new Coordinator();
});

},{"./config.js":1,"./form-field":3,"./utils":7}],3:[function(require,module,exports){
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
            var self = this;

            this.subFieldValidate = _utils.pubSub.subscribe('field:validate:all', function (field) {

                // Determines if this is the field to be validated.
                if (field.uniqueId === self.uniqueId) {
                    self.validate();
                }

                // Async/Handshake Processing
                if (self.fieldState === _config.fieldState.HANDSHAKE) {
                    console.log(self.fieldName + ' is in handshake mode.');
                }
            });

            this.subFieldDestroy = _utils.pubSub.subscribe('field:destroy', function (uniqueId) {
                self.destroy();
            });
        };

        FormField.prototype.listener = function listener() {
            this._fieldElem.addEventListener('change', this.publish.bind(this), false);
        };

        FormField.prototype.publish = function publish() {
            _utils.pubSub.publish('field:validate:all', {
                uniqueId: this.uniqueId,
                objType: this.objType,
                fieldName: this.fieldName,
                fieldState: this.fieldState,
                fieldValue: this.fieldValue,
                fieldValidator: this.fieldValidator
            });
        };

        FormField.prototype.registerValidators = function registerValidators() {
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
                    self._validators.push(new _validator3.default(attribute, attr.value));
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

                if (!_validator.isValid(this.fieldValue)) {
                    this.fieldValidator = _validator;
                    this.fieldState = _validator.key === 'handshake' ? _config.fieldState.HANDSHAKE : _config.fieldState.ERROR;
                    this.showError(_validator.key);
                    return;
                }
            }
            this.fieldValidator = validator;
            this.state = _config.fieldState.SUCCESS;
            this.clearError();
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
            this._fieldElem.removeEventListener('keyup', this.publish.bind(this), false);
            this.subFieldValidate.remove();
            this.subFieldDestroy.remove();
            this._fieldElem = null;
            this._validators.length = 0;
        };

        return FormField;
    }();

    module.exports = FormField;
});

},{"./config.js":1,"./utils.js":7,"./validator":8}],4:[function(require,module,exports){
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

},{"./config.js":1,"./form-field":3,"./messages":6,"./utils.js":7}],5:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './form', './coordinator'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./form'), require('./coordinator'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.form, global.coordinator);
        global.gator = mod.exports;
    }
})(this, function (module, _form, _coordinator) {
    'use strict';

    var _form2 = _interopRequireDefault(_form);

    var _coordinator2 = _interopRequireDefault(_coordinator);

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
            var coord = _coordinator2.default;
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

},{"./coordinator":2,"./form":4}],6:[function(require,module,exports){
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
            console.log(_config.attributes);
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
});

},{}],8:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './config'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./config'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.config);
        global.validator = mod.exports;
    }
})(this, function (module, _config) {
    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Validator = function () {
        function Validator(key, params) {
            _classCallCheck(this, Validator);

            this.key = key;
            this.params = params.length ? params.split(',') : [];
            this.onInit();
        }

        Validator.prototype.onInit = function onInit() {
            this.setPriority();
        };

        Validator.prototype.setPriority = function setPriority() {
            if (!_config.rules.hasOwnProperty(this.key)) {
                throw new Error('Invalid directive, "gt-' + this.key + '"');
            }
            this.priority = _config.rules[this.key].priority;
        };

        Validator.prototype.isValid = function isValid(value) {
            return _config.rules[this.key].fn.call(this, value);
        };

        Validator.prototype.destroy = function destroy() {
            this.params.length = 0;
        };

        return Validator;
    }();

    module.exports = Validator;
});

},{"./config":1}]},{},[5])(5)
});