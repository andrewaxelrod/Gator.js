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

  /* Global Constants */

  var NAMESPACE = exports.NAMESPACE = 'gt';
  var NAMESPACE_PREFIX = exports.NAMESPACE_PREFIX = NAMESPACE + '-';
  var PRIORITY_DEFAULT = exports.PRIORITY_DEFAULT = 30;

  var Options = exports.Options = {
    NAMESPACE: NAMESPACE,
    PRESTINE: true,
    SUBMIT_DISABLED: true
  };

  var Type = exports.Type = {
    FORM: 'FORM',
    FIELD: 'FIELD',
    MESSAGE: 'MESSAGE',
    VALIDATOR: 'VALIDATOR'
  };

  var State = exports.State = {
    INIT: 'INIT',
    VALIDATING: 'VALIDATING',
    GROUP_NOT_READY: 'GROUP_NOT_READY',
    ASYNC: 'ASYNC',
    SKIP: 'SKIP',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
  };

  var Event = exports.Event = {
    KEYUP: 'keyup',
    CHANGE: 'change'
  };

  var RuleTypes = exports.RuleTypes = {
    email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    integer: /^-?\d+$/,
    digits: /\d+$/,
    alphanum: /^\w+$/i,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
  };

  var Rules = exports.Rules = {
    required: {
      fn: function fn(value) {
        return (/\S/.test(value)
        );
      },
      priority: 1024
    },
    type: {
      fn: function fn(value) {
        var regex = RuleTypes[this.params[0]];
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
    same: {
      fn: function fn(fields) {
        var ref = fields[Object.keys(fields)[0]];
        for (var field in fields) {
          if (fields[field] !== ref) {
            return false;
          }
        }
        return true;
      },
      priority: 0,
      group: true
    },
    test: {
      fn: function fn(fields, success, error) {
        window.setTimeout(function () {
          console.log('async function called');
          error();
        }, 2000);
      },
      priority: 0,
      async: true
    }
  };
});

},{}],2:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', './config', './utils', './form', './field', './message'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require('./config'), require('./utils'), require('./form'), require('./field'), require('./message'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.config, global.utils, global.form, global.field, global.message);
        global.factory = mod.exports;
    }
})(this, function (module, _config, _utils, _form, _field, _message) {
    'use strict';

    var util = _interopRequireWildcard(_utils);

    var _form2 = _interopRequireDefault(_form);

    var _field2 = _interopRequireDefault(_field);

    var _message2 = _interopRequireDefault(_message);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var MESSAGES_ATTR = 'messages';

    // A Simple Abstract Factory

    var Factory = function () {
        function Factory() {
            _classCallCheck(this, Factory);
        }

        Factory.prototype.create = function create(type, elem, parent) {
            var key = null;
            switch (type) {
                case _config.Type.FORM:
                    key = '' + util.getName(elem);
                    return new _form2.default(key, elem);
                case _config.Type.FIELD:
                    key = util.getName(parent) + ':' + util.getName(elem);
                    return new _field2.default(key, elem);
                case _config.Type.MESSAGE:
                    key = util.getAttribute(elem, MESSAGES_ATTR);
                    return new _message2.default(key, elem);
            }
        };

        return Factory;
    }();

    module.exports = new Factory();
});

},{"./config":1,"./field":3,"./form":4,"./message":7,"./utils":8}],3:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["module", "./config", "./utils"], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require("./config"), require("./utils"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.config, global.utils);
        global.field = mod.exports;
    }
})(this, function (module, _config, _utils) {
    "use strict";

    var util = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ATTR_REQUIRED = 'required',
        ATTR_REGEX = /^(.*?)(?:\:(\w*)){0,1}$/;

    var Field = function () {
        function Field(key, elem) {
            _classCallCheck(this, Field);

            this.type = _config.Type.FIELD;
            this.state = _config.State.INIT;
            this.key = key || null;
            this.elem = elem || null;
            this.name = elem.name || null;
            this.value = null;
            this.validators = [];
            this.mediator = null;
        }

        Field.prototype.init = function init() {
            this.registerListeners();
            this.getValidators();
            this.initValidators();
        };

        Field.prototype.registerListeners = function registerListeners() {
            this.elem.addEventListener(_config.Event.KEYUP, this, false);
            this.elem.addEventListener(_config.Event.CHANGE, this, false);
        };

        Field.prototype.handleEvent = function handleEvent(event) {
            this.value = this.elem.value;

            switch (event.type) {
                case _config.Event.CHANGE:
                    this.validate(_config.Event.CHANGE);
                    break;
                case _config.Event.KEYUP:
                    this.validate(_config.Event.KEYUP);
                    break;
            }
        };

        Field.prototype.getValidators = function getValidators() {
            var _this = this;

            var self = this,
                regex = new RegExp(_config.NAMESPACE_PREFIX, 'i');

            util.nl2arr(this.elem.attributes).forEach(function (attr) {
                var attribute = null;

                if (attr.name && regex.test(attr.name) && attr.specified) {
                    attribute = attr.name.slice(_config.NAMESPACE_PREFIX.length);
                } else if (attr.name === ATTR_REQUIRED && attr.specified) {
                    attribute = ATTR_REQUIRED;
                }

                if (attribute) {
                    var p = attr.value.match(ATTR_REGEX);
                    _this.validators.push({
                        key: util.convertCamelCase(attribute),
                        params: p[1] ? p[1].split(',') : null,
                        event: p[2] || _config.Event.KEYUP
                    });
                }
            });
        };

        Field.prototype.initValidators = function initValidators() {
            this.mediator.initValidators(this.validators, this.key);
        };

        Field.prototype.validate = function validate(event) {
            this.mediator.validate(event, this.validators, this.key, this.value, this.state);
        };

        Field.prototype.onSuccess = function onSuccess() {
            this.state = _config.State.SUCCESS;
            this.elem.disabled = false;
        };

        Field.prototype.onError = function onError() {
            this.state = _config.State.ERROR;
            this.elem.disabled = false;
        };

        Field.prototype.onAsync = function onAsync() {
            this.state = _config.State.ASYNC;
            this.elem.disabled = true;
        };

        Field.prototype.destroy = function destroy() {
            this.elem.removeEventListener(_config.Event.KEYUP, this, false);
            this.elem.removeEventListener(_config.Event.CHANGE, this, false);
            this.elem = null;
            this.validators.length = 0;
            this.mediator = null;
        };

        return Field;
    }();

    module.exports = Field;
});

},{"./config":1,"./utils":8}],4:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["module", "./config", "./utils"], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require("./config"), require("./utils"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.config, global.utils);
        global.form = mod.exports;
    }
})(this, function (module, _config, _utils) {
    "use strict";

    var util = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var BUTTONS_QUERY = "input[type=button],button[type=submit]";

    var Form = function () {
        function Form(key, elem, name) {
            _classCallCheck(this, Form);

            this.type = _config.Type.FORM;
            this.state = _config.State.INIT;
            this.key = key || null;
            this.elem = elem || null;
            this.name = elem.name || null;
            this.fieldsState = {};
            this.submitButton = null;
            this.mediator = null;
        }

        Form.prototype.init = function init() {
            this.registerButtons();
        };

        Form.prototype.registerButtons = function registerButtons() {
            var buttons = [];

            util.nl2arr(this.elem.querySelectorAll(BUTTONS_QUERY)).forEach(function (btnElem) {
                buttons.push(btnElem);
            });

            if (buttons.length > 1) {
                throw new Error('Only one submit button is allowed per form.');
            }

            this.submitButton = buttons[0];
        };

        Form.prototype.onFieldStateChange = function onFieldStateChange(fieldKey, state) {
            this.fieldsState[fieldKey] = state;
            this.enableDisableSubmitButton();
        };

        Form.prototype.enableDisableSubmitButton = function enableDisableSubmitButton() {
            if (this.fieldsStateSuccessful()) {
                this.submitButton.disabled = false;
            } else {
                this.submitButton.disabled = true;
            }
        };

        Form.prototype.fieldsStateSuccessful = function fieldsStateSuccessful() {
            for (var field in this.fieldsState) {
                if (this.fieldsState.hasOwnProperty(field) && this.fieldsState[field] !== _config.State.SUCCESS) {
                    return false;
                }
            }
            return true;
        };

        Form.prototype.validate = function validate() {
            this.mediator.validateAll();
        };

        Form.prototype.submit = function submit() {};

        Form.prototype.destroy = function destroy() {
            this.elem = null;
            this.errors = null;
            this.submitButton = null;
            this.mediator = null;
        };

        return Form;
    }();

    module.exports = Form;
});

},{"./config":1,"./utils":8}],5:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["module", "./config", "./utils", "./mediator", "./factory", "./validator"], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, require("./config"), require("./utils"), require("./mediator"), require("./factory"), require("./validator"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.config, global.utils, global.mediator, global.factory, global.validator);
        global.gator = mod.exports;
    }
})(this, function (module, _config, _utils, _mediator, _factory, _validator) {
    "use strict";

    var util = _interopRequireWildcard(_utils);

    var _mediator2 = _interopRequireDefault(_mediator);

    var _factory2 = _interopRequireDefault(_factory);

    var _validator2 = _interopRequireDefault(_validator);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
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

    var FORMS_QUERY = "form",
        FIELDS_QUERY = "input:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])" + ",select[required]:not(:disabled):not([readonly])" + ",textarea[required]:not(:disabled):not([readonly])",
        MESSAGES_QUERY = "[" + _config.NAMESPACE_PREFIX + "messages]";

    var Main = function () {
        function Main() {
            _classCallCheck(this, Main);
        }

        Main.prototype._init = function _init(query) {
            this.registerValidator();
            this.registerForms(query);
            this.registerMessages();
            _mediator2.default.init();
        };

        Main.prototype.registerValidator = function registerValidator() {
            _mediator2.default.registerValidator(_validator2.default);
        };

        Main.prototype.registerForms = function registerForms(query) {
            var formObj = null,
                fieldObj = null;

            // Register Forms
            util.nl2arr(document.querySelectorAll(query || FORMS_QUERY)).forEach(function (formElem) {
                formObj = _factory2.default.create(_config.Type.FORM, formElem);
                _mediator2.default.register(formObj);

                // Register Fields within a form
                util.nl2arr(formElem.querySelectorAll(FIELDS_QUERY)).forEach(function (fieldElem) {
                    fieldObj = _factory2.default.create(_config.Type.FIELD, fieldElem, formElem);
                    _mediator2.default.register(fieldObj);
                });
            });
        };

        Main.prototype.registerMessages = function registerMessages(elem) {
            var message = null;

            util.nl2arr(document.querySelectorAll(MESSAGES_QUERY)).forEach(function (msgElem) {
                message = _factory2.default.create(_config.Type.MESSAGE, msgElem);
                _mediator2.default.register(message);
            });
        };

        return Main;
    }();

    var Gator = function (_Main) {
        _inherits(Gator, _Main);

        function Gator() {
            _classCallCheck(this, Gator);

            return _possibleConstructorReturn(this, _Main.call(this));
        }

        Gator.prototype.init = function init(query) {
            this._init(query);
        };

        Gator.prototype.addRuleType = function addRuleType(type, exp) {
            if (!exp instanceof RegExp) {
                throw new Error(exp + " must be a regular expression");
            }
            if (_config.RuleTypes.hasOwnProperty(type)) {
                throw new Error(type + " already exists as a rule type");
            }
            if (typeof type !== 'string') {
                throw new Error(type + " must be a string.");
            }
            _config.RuleTypes[type] = exp;
            return this;
        };

        Gator.prototype.validator = function validator(key, fn, async, group, priority) {
            window.rules = _config.Rules;
            // TO-DO: Check for correct parameters
            _config.Rules[key] = {
                fn: fn,
                priority: priority || 0,
                async: async || false,
                group: group || false
            };
            return this;
        };

        return Gator;
    }(Main);

    module.exports = Gator;
});

},{"./config":1,"./factory":2,"./mediator":6,"./utils":8,"./validator":9}],6:[function(require,module,exports){
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
        global.mediator = mod.exports;
    }
})(this, function (module, _config) {
    'use strict';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Mediator = function () {
        function Mediator() {
            _classCallCheck(this, Mediator);

            this.fields = {}, this.forms = {}, this.messages = {}, this.validator = null;
            this.prestine = false;
        }

        Mediator.prototype.register = function register(obj) {
            switch (obj.type) {
                case _config.Type.FORM:
                    this.forms[obj.key] = obj;
                    this.forms[obj.key].mediator = this;
                    this.forms[obj.key].init();
                    break;
                case _config.Type.FIELD:
                    this.fields[obj.key] = obj;
                    this.fields[obj.key].mediator = this;
                    this.fields[obj.key].init();
                    break;
                case _config.Type.MESSAGE:
                    this.messages[obj.key] = obj;
                    this.messages[obj.key].mediator = this;
                    this.messages[obj.key].init();
                    break;
            }
        };

        Mediator.prototype.registerValidator = function registerValidator(obj) {
            this.validator = obj;
            this.validator.mediator = this;
        };

        Mediator.prototype.init = function init() {
            this.validateAll();
            this.prestine = true;
        };

        Mediator.prototype.validate = function validate(event, validators, fieldKey, fieldValue, state) {
            this.validator.validate(event, validators, fieldKey, fieldValue, state);
        };

        Mediator.prototype.validateAll = function validateAll() {
            var field = null;

            for (var fieldKey in this.fields) {
                if (this.fields.hasOwnProperty(fieldKey)) {
                    field = this.fields[fieldKey];
                    this.validate(_config.Event.KEYUP, field.validators, field.key, field.value || '', field.state);
                }
            }
        };

        Mediator.prototype.validateResponse = function validateResponse(state, fieldKey, validatorKey) {
            var formKey = fieldKey.split(':')[0];

            this.forms[formKey].onFieldStateChange(fieldKey, state);

            switch (state) {
                case _config.State.VALIDATING:
                    break;
                case _config.State.ASYNC:
                    this.messages[fieldKey].clear();
                    this.fields[fieldKey].onAsync();
                    break;
                case _config.State.ERROR:
                    if (this.prestine) {
                        this.messages[fieldKey].showMessage(validatorKey);
                    }
                    this.fields[fieldKey].onError();
                    break;
                case _config.State.SUCCESS:
                    this.messages[fieldKey].clear();
                    this.fields[fieldKey].onSuccess();
                    break;
            }
        };

        Mediator.prototype.initValidators = function initValidators(validators, key) {
            this.validator.initValidators(validators, key);
        };

        Mediator.prototype.destroy = function destroy() {
            this.forms = null;
            this.fields = null;
            this.messages = null;
            this.validator = null;
            this.mediator = null;
        };

        return Mediator;
    }();

    module.exports = new Mediator();
});

},{"./config":1}],7:[function(require,module,exports){
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
        global.message = mod.exports;
    }
})(this, function (module, _config, _utils) {
    'use strict';

    var util = _interopRequireWildcard(_utils);

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var MESSAGE_QUERY = '[' + _config.NAMESPACE + '-message]',
        ATTR_MESSAGE = 'message',
        StyleDisplay = {
        BLOCK: 'block',
        NONE: 'none'
    };

    var Message = function () {
        function Message(key, elem) {
            _classCallCheck(this, Message);

            this.type = _config.Type.MESSAGE;
            this.key = key;
            this.elem = elem || null;
            this.messages = {};
            this.mediator = null;
        }

        Message.prototype.init = function init() {
            this.registerBlockMessages();
            this.clear();
        };

        Message.prototype.showMessage = function showMessage(key) {
            this.clear();
            if (this.messages.hasOwnProperty(key)) {
                this.messages[key].style.display = StyleDisplay.BLOCK;
            }
        };

        Message.prototype.clear = function clear() {
            for (var key in this.messages) {
                if (this.messages.hasOwnProperty(key)) {
                    this.messages[key].style.display = StyleDisplay.NONE;
                }
            }
        };

        Message.prototype.registerBlockMessages = function registerBlockMessages() {
            var self = this,
                key = null;

            util.nl2arr(self.elem.querySelectorAll(MESSAGE_QUERY)).forEach(function (elem) {
                key = util.getAttribute(elem, ATTR_MESSAGE);

                if (key) {
                    self.messages[key] = elem;
                }
            });
        };

        Message.prototype.destroy = function destroy() {
            this.elem = null;
            this.messages = null;
            this.mediator = null;
        };

        return Message;
    }();

    module.exports = Message;
});

},{"./config":1,"./utils":8}],8:[function(require,module,exports){
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
    exports.convertCamelCase = convertCamelCase;
    exports.isElement = isElement;
    exports.getName = getName;
    exports.getAttribute = getAttribute;
    exports.renameKeys = renameKeys;
    exports.extend = extend;
    function nl2arr(nodeList) {
        return Array.prototype.slice.call(nodeList);
    };

    function convertCamelCase(str) {
        return str.replace(/-([a-z])/g, function (s) {
            return s[1].toUpperCase();
        });
    };

    function isElement(obj) {
        return (obj[0] || obj).nodeType;
    }

    function getName(elem) {
        return elem && elem.hasAttribute('name') ? elem.name : null;
    }

    function getAttribute(elem, attribute) {
        return elem && elem.hasAttribute('gt-' + attribute) ? elem.getAttribute('gt-' + attribute) : null;
    }

    var log = exports.log = {
        error: function error(msg) {
            throw new Error(msg);
        },
        warn: function warn(msg) {
            throw new Warning(msg);
        }
    };

    function renameKeys(obj) {
        var objCache = {};
        for (var attrname in obj) {
            if (obj.hasOwnProperty(attrname)) {
                objCache[attrname.split(':')[1]] = obj[attrname];
            }
        }
        return objCache;
    }

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param {Object} obj1
     * @param {Object} obj2
     */
    function extend(obj1, obj2) {
        for (var attrname in obj2) {
            if (obj2.hasOwnProperty(attrname)) {
                obj1[attrname] = obj2[attrname];
            }
        }
        return obj1;
    }
});

},{}],9:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "./config", "./utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require("./config"), require("./utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.config, global.utils);
    global.validator = mod.exports;
  }
})(this, function (module, _config, _utils) {
  "use strict";

  var util = _interopRequireWildcard(_utils);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Validator = function () {

    /**
    * Create a validator 
    */
    function Validator() {
      _classCallCheck(this, Validator);

      this.fields = {};
      this.mediator = null;
    }

    // TO-DO: Need to add to unit test


    Validator.prototype.validate = function validate(event, validators, fieldKey, fieldValue, fieldState) {
      if (!(validators instanceof Array) || typeof fieldKey !== 'string' || (typeof fieldValue === "undefined" ? "undefined" : _typeof(fieldValue)) !== ('string' || 'number')) {
        throw new Error("Validator.validatorLoop must have valid paramaters.");
      }

      var validated = null,
          fields = null;

      // If field keys exist in the field cache, update their values.
      for (var validatorKey in this.fields) {
        if (this.fields[validatorKey].hasOwnProperty(fieldKey)) {
          this.fields[validatorKey][fieldKey] = fieldValue;
        }
      }

      validated = this.validateLoop(event, validators, fieldValue, fieldState);

      fields = this.fields.hasOwnProperty(validated.validatorKey) ? this.fields[validated.validatorKey] : null;

      // ASYNC Field Validation
      if (validated.async) {

        _config.Rules[validated.validatorKey].fn(fields, this.asyncCallback.bind({ mediator: this.mediator, fields: fields, validatorKey: validated.validatorKey, state: _config.State.SUCCESS }), this.asyncCallback.bind({ mediator: this.mediator, fields: fields, validatorKey: validated.validatorKey, state: _config.State.ERROR }));

        this.mediator.validateResponse(validated.state, fieldKey, validated.validatorKey);
        // Group Field Validation
      } else if (validated.group) {
        for (var _fieldKey in fields) {
          if (fields.hasOwnProperty(_fieldKey)) {
            this.mediator.validateResponse(validated.state, _fieldKey, validated.validatorKey);
          }
        }
        // Single Field Validation
      } else if (validated.state !== _config.State.SKIP) {
        this.mediator.validateResponse(validated.state, fieldKey, validated.validatorKey);
      }
    };

    Validator.prototype.validateLoop = function validateLoop(event, validators, fieldValue, fieldState) {

      // TO-DO Could be removed...
      if (typeof event !== 'string' || !(validators instanceof Array) || (typeof fieldValue === "undefined" ? "undefined" : _typeof(fieldValue)) !== ('string' || 'number')) {
        throw new Error("Validator.validatorLoop must have valid paramaters.");
      }

      var result = {
        state: _config.State.VALIDATING,
        fieldValue: fieldValue
      };

      for (var _iterator = validators, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var validator = _ref;


        if (!validator.key || !_config.Rules.hasOwnProperty(validator.key)) {
          throw new Error("Validator.validatorLoop: " + validator.key + " must be a valid validator.");
        }

        result.validatorKey = validator.key;
        result.async = false;
        result.group = false;

        if (validator.event === _config.Event.CHANGE && fieldState === _config.State.ERROR || event !== validator.event) {
          if (fieldState === _config.State.SUCCESS) {
            result.state = _config.State.SUCCESS;
          }
        } else if (validator.async) {
          if (this.isFieldGroupReady(validator.key)) {
            result.async = true;
            result.state = _config.State.ASYNC;
          } else {
            result.state = _config.State.SKIP;
          }
          break;
        } else if (validator.group) {
          if (!_config.Rules[validator.key].group) {
            throw new Error("Validator.validatorLoop: " + validator.key + " must be a group validator.");
          }

          result.group = true;

          if (!_config.Rules[validator.key].fn.call(validator, this.fields[validator.key])) {
            result.state = _config.State.ERROR;
            break;
          } else {
            result.state = _config.State.SUCCESS;
          }
        } else {
          if (!_config.Rules[validator.key].fn.call(validator, fieldValue)) {
            result.state = _config.State.ERROR;
            break;
          } else {
            result.state = _config.State.SUCCESS;
          }
        }
      }

      return result;
    };

    Validator.prototype.isFieldGroupReady = function isFieldGroupReady(validatorKey) {
      if (!validatorKey || !this.fields.hasOwnProperty(validatorKey)) {
        throw new Error("Validator.isFieldGroupReady: " + validatorKey + " not found in validator.fields.");
      }
      var fields = this.fields[validatorKey];
      for (var fieldKey in fields) {
        if (fields.hasOwnProperty(fieldKey)) {
          if (fields[fieldKey] === null || fields[fieldKey].length === 0) {
            return false;
          }
        }
      }
      return true;
    };

    Validator.prototype.asyncCallback = function asyncCallback() {
      for (var fieldKey in this.fields) {
        if (this.fields.hasOwnProperty(fieldKey)) {
          this.mediator.validateResponse(this.state, fieldKey, this.validatorKey);
        }
      }
    };

    Validator.prototype.initValidators = function initValidators(validators, fieldKey) {
      if (!fieldKey || typeof fieldKey !== 'string' || !(validators instanceof Array)) {
        throw new Error("Validator.initValidators: Invalid paramaters.");
      }

      for (var _iterator2 = validators, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var validator = _ref2;

        if (!_config.Rules.hasOwnProperty(validator.key)) {
          throw new Error("Validator.initValidators: " + validator.key + " is an Invalid validator");
        }

        util.extend(validator, {
          priority: _config.Rules[validator.key].priority || 0,
          group: _config.Rules[validator.key].group || false,
          async: _config.Rules[validator.key].async || false
        });

        // If validator is a group or async validator, add it with the field to the this.field cache object.
        if (validator.group || validator.async) {
          if (!this.fields.hasOwnProperty(validator.key)) {
            this.fields[validator.key] = {};
          }
          this.fields[validator.key][fieldKey] = null;
        }
      }

      // Sort the validators based on priority.
      validators.sort(function (a, b) {
        return b.priority - a.priority;
      });
    };

    return Validator;
  }();

  /** @module Validator Singleton */
  module.exports = new Validator();
});

},{"./config":1,"./utils":8}]},{},[5])(5)
});