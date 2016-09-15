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

  var appPrefix = exports.appPrefix = 'gt-';

  var fieldQuery = exports.fieldQuery = {
    input: 'input[required]:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
    select: ',select[required]:not(:disabled):not([readonly])',
    textarea: ',textarea[required]:not(:disabled):not([readonly])',
    messages: 'gt-messages',
    message: 'gt-message'
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
        function FormField(parent, elem) {
            _classCallCheck(this, FormField);

            this.parent = parent;
            this.elem = elem;
            this.name = this.elem.getAttribute("name");
            this.validators = [];
            this.valid = true;
            this.validatorKey = null;
            this.onInit();
        }

        FormField.prototype.onInit = function onInit() {
            var _this = this;

            var self = this;
            this.registerValidators();
            this.prioritizeValidators();
            this.listener();

            this.subscription = _utils.pubSub.subscribe('validate:field', function (form) {
                if (form === _this.parent) {
                    self.valdate();
                }
            });
        };

        FormField.prototype.listener = function listener() {
            var _this2 = this;

            this.elem.addEventListener('keyup', function () {
                _this2.validate();
            });
        };

        FormField.prototype.registerValidators = function registerValidators() {
            var self = this,
                attribute = null,
                regex = new RegExp("^" + _config.appPrefix, 'i');

            (0, _utils.nl2arr)(this.elem.attributes).forEach(function (attr) {
                if (attr.name && regex.test(attr.name) && attr.specified) {
                    attribute = attr.name.slice(_config.appPrefix.length);
                } else if (attr.name === 'required' && attr.specified) {
                    attribute = 'required';
                } else {
                    attribute = null;
                }
                if (attribute) {
                    self.validators.push(new _validator2.default(attribute, attr.value));
                }
            });
        };

        FormField.prototype.prioritizeValidators = function prioritizeValidators() {
            if (this.validators.length) {
                this.validators.sort(function (a, b) {
                    return b.priority - a.priority;
                });
            }
        };

        FormField.prototype.validate = function validate() {

            var value = this.elem.value;
            this.valid = true;
            this.validatorKey = null;

            for (var _iterator = this.validators, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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

                if (!validator.isValid(value)) {
                    this.valid = false;
                    this.validatorKey = validator.key;
                    _utils.pubSub.publish('messages:show', {
                        fieldName: this.name,
                        formName: this.parent.name,
                        key: validator.key
                    });
                    break;
                }
            }

            if (this.valid) {
                _utils.pubSub.publish('messages:clear', {
                    fieldName: this.name,
                    formName: this.parent.name
                });
            }
        };

        FormField.prototype.destroy = function destroy() {
            this.subscription.remove();
        };

        return FormField;
    }();

    module.exports = FormField;
});

},{"./config.js":1,"./utils.js":6,"./validator":7}],3:[function(require,module,exports){
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
            util.nl2arr(this.elem.querySelectorAll(_config.fieldQuery.input + _config.fieldQuery.select + _config.fieldQuery.textarea)).forEach(function (elem) {
                _this.fields.push(new _formField2.default(_this, elem));
            });
        };

        Form.prototype.registerMessages = function registerMessages() {
            var _this2 = this;

            var self = this;
            util.nl2arr(this.elem.querySelectorAll('[' + _config.fieldQuery.messages + ']')).forEach(function (elem) {
                _this2.messages.push(new _messages2.default(_this2, elem));
            });
        };

        Form.prototype.destroy = function destroy() {
            this.elem = null;
            this.fields = [];
        };

        return Form;
    }();

    module.exports = Form;
});

},{"./config.js":1,"./form-field":2,"./messages":5,"./utils.js":6}],4:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', './form'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('./form'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.form);
    global.gator = mod.exports;
  }
})(this, function (module, _form) {
  'use strict';

  var _form2 = _interopRequireDefault(_form);

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

  var Gator = function Gator() {
    _classCallCheck(this, Gator);

    var elem = document.getElementById('customerForm');
    var elemForm = new _form2.default(elem);
  };

  module.exports = Gator;
});

},{"./form":3}],5:[function(require,module,exports){
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
        function Messages(parent, elem) {
            _classCallCheck(this, Messages);

            this.parent = parent;
            this.elem = elem;
            this.messages = {};
            this.formName = null;
            this.fieldName = null;
            this.onInit();
        }

        Messages.prototype.onInit = function onInit() {
            var attrs = this.elem.getAttribute(_config.fieldQuery.messages).split('.');
            this.formName = attrs[0];
            this.fieldName = attrs[1];

            this.registerMsgs();
            this.hideAllMessages();
            this.subscribe();
        };

        Messages.prototype.subscribe = function subscribe() {
            var self = this;
            this.subShow = _utils.pubSub.subscribe('messages:show', function (obj) {
                if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                    self.hideAllMessages();
                    self.show(obj.key);
                }
            });

            this.subClear = _utils.pubSub.subscribe('messages:clear', function (obj) {
                if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                    self.hideAllMessages();
                }
            });
        };

        Messages.prototype.registerMsgs = function registerMsgs() {
            var self = this;
            (0, _utils.nl2arr)(this.elem.querySelectorAll("[" + _config.fieldQuery.message + "]")).forEach(function (elem) {
                var key = elem.getAttribute(_config.fieldQuery.message);
                if (key) {
                    self.messages[key] = elem;
                }
            });
        };

        Messages.prototype.show = function show(key) {
            this.messages[key].style.display = 'block';
        };

        Messages.prototype.hideAllMessages = function hideAllMessages() {
            var messages = this.messages;
            for (var key in messages) {
                if (messages.hasOwnProperty(key)) {
                    messages[key].style.display = 'none';
                }
            }
        };

        Messages.prototype.destroy = function destroy() {
            this.elem = null;
            this.messages = null;
            this.subShow.remove();
            this.subClear.remove();
        };

        return Messages;
    }();

    module.exports = Messages;
});

},{"./config.js":1,"./utils.js":6}],6:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
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
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.nl2arr = nl2arr;
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
});

},{}],7:[function(require,module,exports){
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
            this.params = params.split(',');
            this.priority = _config.rules[key].priority;
        }

        Validator.prototype.isValid = function isValid(value) {
            return _config.rules[this.key].fn.call(this, value);
        };

        return Validator;
    }();

    module.exports = Validator;
});

},{"./config":1}]},{},[4])(4)
});