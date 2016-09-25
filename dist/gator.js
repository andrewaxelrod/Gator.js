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
  var validatorState = exports.validatorState = {
    INIT: 0,
    WAIT: 1,
    SUCCESS: 2,
    ERROR: 4,
    HANDSHAKE: 5
  };

  var Events = exports.Events = {
    KEYUP: 'keyup',
    CHANGE: 'change'
  };

  var objType = exports.objType = {
    FIELD: 0,
    FORM: 1,
    MESSAGE: 2
  };

  var PREFIX = exports.PREFIX = 'gt';

  var fieldQuery = exports.fieldQuery = {
    prefix: '^' + PREFIX,
    input: 'input:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
    select: ',select[required]:not(:disabled):not([readonly])',
    textarea: ',textarea[required]:not(:disabled):not([readonly])',
    form: 'form[name="{{name}}"]',
    messages: '[' + PREFIX + '-messages]',
    message: '[' + PREFIX + '-message]'
  };

  var attributes = exports.attributes = {
    prefix: PREFIX + '-',
    messages: PREFIX + '-messages',
    message: PREFIX + '-message'
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

  var PRIORITY_DEFAULT = exports.PRIORITY_DEFAULT = 30;

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
    group: {
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
      handshake: true,
      required: false
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
      handshake: true,
      required: true // All fields must pass all initial validators up until the handshake or won't be called.
    }
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
})(this, function (module, _config, _utils, _validator) {
    "use strict";

    var _validator2 = _interopRequireDefault(_validator);

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
            this.formName = formName;
            this._fieldElem = fieldElem;
            this.fieldName = fieldElem.getAttribute("name");
            this._validators = [];
            this.validatorIndex = 0;
            this.onInit();
        }

        FormField.prototype.onInit = function onInit() {
            this.registerValidators();
            this.prioritizeValidators();
            this.subscribe();
            this.listeners();
        };

        FormField.prototype.handleEvent = function handleEvent(event) {
            switch (event.type) {
                case _config.Events.CHANGE:
                    this.validatorLoop(_config.Events.CHANGE);
                    break;
                case _config.Events.KEYUP:
                    this.validatorIndex = 0;
                    this.validatorLoop(_config.Events.KEYUP);
                    break;
            }
        };

        FormField.prototype.listeners = function listeners() {
            this._fieldElem.addEventListener(_config.Events.KEYUP, this, false);
            this._fieldElem.addEventListener(_config.Events.CHANGE, this, false);
        };

        FormField.prototype.subscribe = function subscribe() {
            this.subCBSuccess = _utils.pubSub.subscribe('field:callbackSuccess', this.callbackSuccess.bind(this));
            this.subCBError = _utils.pubSub.subscribe('field:callbackError', this.callbackError.bind(this));
            this.subCBDestroy = _utils.pubSub.subscribe('field:destroy', this.destroy.bind(this));
        };

        FormField.prototype.callbackSuccess = function callbackSuccess(obj) {
            if (this.uniqueId === obj.uniqueId) {
                this.enable();
                this.clearError();
            }
        };

        FormField.prototype.callbackError = function callbackError(obj) {
            if (this.uniqueId === obj.uniqueId) {
                this.enable();
                if (this._validators[this.validatorIndex].state !== _config.validatorState.ERROR) {
                    this.showError(obj.key);
                }
            }
        };

        FormField.prototype.handshake = function handshake(validatorKey, fieldValue) {
            _utils.pubSub.publish('handshake:execute', {
                uniqueId: this.uniqueId,
                fieldName: this.fieldName,
                fieldValue: fieldValue,
                key: validatorKey
            });
        };

        FormField.prototype.validatorLoop = function validatorLoop(event) {
            var fieldValue = this._fieldElem.value,
                validator = null,
                validators = this._validators;

            for (var i = this.validatorIndex, len = this._validators.length; i < len; i++) {
                validator = validators[i];
                if (event === validator.event || validator.event === _config.Events.KEYUP) {
                    this.validatorIndex = i;
                    this.clearError();
                    validator.validate(fieldValue);
                    if (validator.isHandshake()) {
                        this.handshake(validator.key, fieldValue);
                        return;
                    } else if (validator.isError()) {
                        this.showError(validator.key);
                        return;
                    }
                }
            }
            // SUCCESS STATE
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
                    self._validators.push(new _validator2.default((0, _utils.convertCamelCase)(attribute), attr.value, _this.fieldName, _this.uniqueId));
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

        FormField.prototype.enable = function enable() {
            this._fieldElem.disabled = false;
        };

        FormField.prototype.disable = function disable() {
            this._fieldElem.disabled = true;
        };

        FormField.prototype.destroy = function destroy() {
            console.log("fields are destroyed!");
            this._fieldElem.removeEventListener('keyup', this, false);
            this._fieldElem.removeEventListener('change', this, false);
            this._fieldElem = null;
            this._validators.length = 0;
            this.subCBSuccess.remove();
            this.subCBError.remove();
            this.subCBDestroy.remove();
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
        function Form(formElem) {
            _classCallCheck(this, Form);

            this._elem = formElem;
            this._fields = [];
            this.name = null;
            this.onInit();
        }

        Form.prototype.onInit = function onInit() {
            this.name = this._elem.getAttribute("name");
            this.registerFormFields();
            this.subscribe();
        };

        Form.prototype.subscribe = function subscribe() {
            this.subCBDestroy = _utils.pubSub.subscribe('form:destroy', this.destroy.bind(this));
        };

        Form.prototype.registerFormFields = function registerFormFields() {
            var _this = this;

            (0, _utils.nl2arr)(this._elem.querySelectorAll(_config.fieldQuery.input + _config.fieldQuery.select + _config.fieldQuery.textarea)).forEach(function (fieldElem) {
                _this._fields.push(new _formField2.default(fieldElem, _this.name));
            });
        };

        Form.prototype.destroy = function destroy() {
            console.log('form is destroyed');
            this._elem = null;
            this._fields.length = 0;
            this.subCBDestroy.remove();
        };

        return Form;
    }();

    module.exports = Form;
});

},{"./config.js":1,"./form-field":2,"./messages":6,"./utils.js":7}],4:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './config', './utils.js', './form', './messages', './handshake'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./config'), require('./utils.js'), require('./form'), require('./messages'), require('./handshake'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.config, global.utils, global.form, global.messages, global.handshake);
        global.gator = mod.exports;
    }
})(this, function (module, _config, _utils, _form, _messages, _handshake) {
    'use strict';

    var _form2 = _interopRequireDefault(_form);

    var _messages2 = _interopRequireDefault(_messages);

    var _handshake2 = _interopRequireDefault(_handshake);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Main = function () {
        function Main(formName) {
            _classCallCheck(this, Main);

            this._messages = [];
            this._forms = [];
            this._handshake = null;
        }

        Main.prototype._init = function _init(formName) {
            this._handshake = new _handshake2.default();
            this._registerMessages();
            this._registerForm(formName);
        };

        Main.prototype._registerForm = function _registerForm(formName) {
            var _this = this;

            var query = formName ? _config.fieldQuery.form.replace(/\{\{name\}\}/, formName) : 'form';
            (0, _utils.nl2arr)(document.querySelectorAll(query)).forEach(function (formElem) {
                _this._forms.push(new _form2.default(formElem));
            });
        };

        Main.prototype._registerMessages = function _registerMessages() {
            var _this2 = this;

            (0, _utils.nl2arr)(document.querySelectorAll(_config.fieldQuery.messages)).forEach(function (msgElem) {
                _this2._messages.push(new _messages2.default(msgElem));
            });
        };

        Main.prototype._destroy = function _destroy() {
            console.log('main is destroyed');
            _utils.pubSub.publish('field:destroy', {});
            _utils.pubSub.publish('messages:destroy', {});
            _utils.pubSub.publish('handshake:destroy', {});
            _utils.pubSub.publish('form:destroy', {});
            _utils.pubSub.publish('validator:destroy', {});
            this._messages.length = 0;
            this._forms.length = 0;
            this._handshake = null;
        };

        return Main;
    }();

    var Gator = function (_Main) {
        _inherits(Gator, _Main);

        function Gator() {
            _classCallCheck(this, Gator);

            return _possibleConstructorReturn(this, _Main.call(this));
        }

        Gator.prototype.addRuleType = function addRuleType(type, exp) {
            if (!exp instanceof RegExp) {
                throw new Error(exp + ' must be a regular expression');
            }
            if (_config.ruleTypes.hasOwnProperty(type)) {
                throw new Error(type + ' already exists as a rule type');
            }
            if (typeof type !== 'string') {
                throw new Error(type + ' must be a string.');
            }
            _config.ruleTypes[type] = exp;
            return this;
        };

        Gator.prototype.validator = function validator(key, fn, required, priority) {
            // TO-DO: Check for correct parameters
            _config.rules[key] = {
                fn: fn,
                priority: priority || 0,
                handshake: true,
                required: required || false
            };
            return this;
        };

        Gator.prototype.destroy = function destroy() {
            this._destroy();
            return this;
        };

        Gator.prototype.init = function init(formName) {
            this._init(formName);
            return this;
        };

        return Gator;
    }(Main);

    module.exports = Gator;
});

},{"./config":1,"./form":3,"./handshake":5,"./messages":6,"./utils.js":7}],5:[function(require,module,exports){
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

    var fieldWrapper = function () {
        function fieldWrapper(uniqueId) {
            _classCallCheck(this, fieldWrapper);

            this.uniqueId = uniqueId;
            this.value = null;
            this.ready = false;
        }

        fieldWrapper.prototype.isType = function isType(type) {
            return _config.rules.type.fn.call({ params: [type] }, this.value);
        };

        return fieldWrapper;
    }();

    var Handshake = function () {
        function Handshake() {
            _classCallCheck(this, Handshake);

            this._handshakes = {};
            this.onInit();
        }

        Handshake.prototype.onInit = function onInit() {
            this.subscribe();
        };

        Handshake.prototype.subscribe = function subscribe() {
            this.subRegister = _utils.pubSub.subscribe('handshake:register', this.register.bind(this));
            this.subAddField = _utils.pubSub.subscribe('handshake:addField', this.addField.bind(this));
            this.subExecute = _utils.pubSub.subscribe('handshake:execute', this.execute.bind(this));
            this.subDestroy = _utils.pubSub.subscribe('handshake:destroy', this.destroy.bind(this));
            // this.subReset = pubSub.subscribe('handshake:reset', this.reset.bind(this)); 
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
            this._handshakes[obj.key].fields[obj.fieldName] = new fieldWrapper(obj.uniqueId);
        };

        Handshake.prototype.setFieldReady = function setFieldReady(key, fieldName, value) {
            var field = this._handshakes[key].fields[fieldName];
            field.value = value;
            field.ready = true;
        };

        Handshake.prototype.checkFieldsReady = function checkFieldsReady(key) {
            var fields = this._handshakes[key].fields;
            for (var field in fields) {
                if (fields.hasOwnProperty(field)) {
                    if (!fields[field].ready) {
                        return false;
                    }
                }
            }
            return true;
        };

        Handshake.prototype.execute = function execute(obj) {
            var required = _config.rules[obj.key].hasOwnProperty('required') ? _config.rules[obj.key].required : false;
            this.setFieldReady(obj.key, obj.fieldName, obj.fieldValue);
            if (this.checkFieldsReady(obj.key) || !required) {
                // Execute Function
                _config.rules[obj.key].fn(this._handshakes[obj.key].fields, this.callback.bind(this._handshakes[obj.key], 'field:callbackSuccess'), this.callback.bind(this._handshakes[obj.key], 'field:callbackError'), this.callback.bind(this._handshakes[obj.key], 'field:callbackIgnore'));
            }
        };

        Handshake.prototype.callback = function callback(event) {
            for (var field in this.fields) {
                if (this.fields.hasOwnProperty(field)) {
                    _utils.pubSub.publish(event, {
                        uniqueId: this.fields[field].uniqueId,
                        key: this.key
                    });
                }
            }
        };

        Handshake.prototype.destroy = function destroy() {
            console.log('handshake is destroyed.');
            this._handshakes = null;
            this.subRegister.remove();
            this.subAddField.remove();
            this.subExecute.remove();
            this.subDestroy.remove();
        };

        return Handshake;
    }();

    module.exports = Handshake;
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

    var Message = function () {
        function Message(msgsElem) {
            _classCallCheck(this, Message);

            this._elem = msgsElem;
            this._messages = {};
            this.formName = null;
            this.fieldName = null;
            this.onInit();
        }

        Message.prototype.onInit = function onInit() {
            var attrs = this._elem.getAttribute(_config.attributes.messages).split('.');
            this.formName = attrs[0];
            this.fieldName = attrs[1];
            this.registerBlockMessages();
            this.subscribe();
            this.clearMessages();
        };

        Message.prototype.subscribe = function subscribe() {
            this.subShow = _utils.pubSub.subscribe('messages:show', this.showMessage.bind(this));
            this.subClear = _utils.pubSub.subscribe('messages:clear', this.clearMessages.bind(this));
            this.subDestroy = _utils.pubSub.subscribe('messages:destroy', this.destroy.bind(this));
        };

        Message.prototype.clearMessages = function clearMessages(obj) {
            var messages = this._messages;
            if (obj === undefined || obj.fieldName === this.fieldName && obj.formName === this.formName) {
                for (var key in messages) {
                    if (this._messages.hasOwnProperty(key)) {
                        messages[key].style.display = 'none';
                    }
                }
            }
        };

        Message.prototype.showMessage = function showMessage(obj) {
            if (obj.fieldName === this.fieldName && obj.formName === this.formName) {
                this.clearMessages(obj);
                if (this._messages.hasOwnProperty(obj.key)) {
                    this._messages[obj.key].style.display = 'block';
                }
            }
        };

        Message.prototype.isKeyValid = function isKeyValid(key) {
            if (!this._messages.hasOwnProperty(key)) {
                throw new Error("Missing \"gt-" + key + " in gt-messages=\"" + this.formName + "." + this.fieldName + "\"");
            }
        };

        Message.prototype.registerBlockMessages = function registerBlockMessages() {
            var self = this,
                key = null;
            (0, _utils.nl2arr)(this._elem.querySelectorAll(_config.fieldQuery.message)).forEach(function (msgElem) {
                key = msgElem.getAttribute(_config.attributes.message);
                if (key) {
                    self._messages[key] = msgElem;
                }
            });
        };

        Message.prototype.destroy = function destroy() {
            console.log('messages are destroyed');
            this._elem = null;
            this._messages = null;
            this.subShow.remove();
            this.subClear.remove();
            this.subDestroy.remove();
        };

        return Message;
    }();

    module.exports = Message;
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
  exports.convertCamelCase = convertCamelCase;
  function nl2arr(nodeList) {
    return Array.prototype.slice.call(nodeList);
  };

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
  };

  function convertCamelCase(str) {
    return str.replace(/-([a-z])/g, function (s) {
      return s[1].toUpperCase();
    });
  };
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

            var p = params.match(/^(.*?)(?:\:(\w*)){0,1}$/);
            this.params = p[1] ? p[1].split(',') : null;
            this.event = p[2] || _config.Events.KEYUP;
            this.onInit();
        }

        Validator.prototype.onInit = function onInit() {
            this.setPriority();
            this.setHandshake();
            this.subscribe();
        };

        Validator.prototype.subscribe = function subscribe() {
            this.subCBDestroy = _utils.pubSub.subscribe('validator:destroy', this.destroy.bind(this));
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

        Validator.prototype.isHandshake = function isHandshake() {
            return this.state === _config.validatorState.HANDSHAKE;
        };

        Validator.prototype.isError = function isError() {
            return this.state === _config.validatorState.ERROR;
        };

        Validator.prototype.destroy = function destroy() {
            console.log('valdidator is destroyed!');
            this.params.length = 0;
            this.subCBDestroy.remove();
        };

        return Validator;
    }();

    module.exports = Validator;
});

},{"./config":1,"./utils":7}]},{},[4])(4)
});