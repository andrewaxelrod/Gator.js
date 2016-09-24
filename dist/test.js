 
 const priorityDefault = 30;

const appPrefix = 'gt';

const  fieldQuery = {
      prefix: `^${appPrefix}`,
      input: 'input:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
      select: ',select[required]:not(:disabled):not([readonly])',
      textarea: ',textarea[required]:not(:disabled):not([readonly])',
      messages: `[${appPrefix}-messages]`,
      message: `[${appPrefix}-message]`
};

const attributes = {
    prefix: `${appPrefix}-`,
    messages: `${appPrefix}-messages`,
    message: `${appPrefix}-message`
}

const ruleTypes = {
    email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    integer: /^-?\d+$/,
    digits: /\d+$/,
    alphanum: /^\w+$/i,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
}
const rules = { 
    required: {
        fn: function(value) {
          return (/\S/.test(value));
        },
        priority: 1024,
        handshake: false
      }, 
      type: {
        fn: function(value) {
          var regex = ruleTypes[this.params[0]];
          return regex.test(value);
        },
        priority: 256,
        handshake: false
      }, 
      minlength: {
        fn: function(value) {
           return value.length >= this.params[0]
        },
        priority: 512,
        handshake: false
      },
      maxlength: {
        fn: function(value) {
           return value.length <= this.params[0]
        },
        priority: 512,
        handshake: false
      },
      handshake: {
        fn: function(fields, success, error) {
          console.log('Inside handshake');
          error();
        },
        priority: 0,
        handshake: true
      },
      all: {
        fn: function(fields, success, error) {
          for(let field in fields) {
            if(!fields[field].value) {
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
        fn: function(fields, success, error) {
          for(let field in fields) {
            if(fields[field].value) {
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
        fn: function(fields, success, error) {
          let ref = fields[Object.keys(fields)[0]];
          for(let field in fields) {
             if(fields[field].value !== ref.value) {
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
        fn: function(fields) {
          for(let field of fields) {
            if(!field.value) {
              return false;
            }
          }
          return true;
        },
        priority: 0,
        handshake: true
      },
      custom: {
        fn: function(fields, success, error, ignore) {
          if(fields.email.isEmail()) {
            success()
          } else  {
            error();
          }  
          
           
        },
        priority: 0,
        handshake: true,
        required: false 
      },
     custom2: {
        fn: function(fields, success, error, ignore, ajax) {

          
         
           
        },
        priority: 0,
        handshake: true,
        required: false 
      }
};
 
// Simple version of an Enums
export const fieldState = {
    INIT: 0,
    WAIT: 1,
    SUCCESS: 2,
    ERROR: 4,
    HANDSHAKE: 5
};

// Simple version of an Enums
export const validatorState = {
    INIT: 0,
    SUCCESS: 1,
    ERROR: 2,
    HANDSHAKE: 3
};

export const objType = {
    FIELD: 0,
    FORM: 1,
    MESSAGE: 2 
};
 

class FormField { 
 
    constructor(fieldElem, formName) { 
        this.uniqueId = getUniqueId();
        this.objType = objType.FIELD;
        this.fieldState = fieldState.INIT;
        this._fieldElem = fieldElem;
        this.fieldName = fieldElem.getAttribute("name");
        this.fieldValue =  this._fieldElem.value;
        this.fieldValidator = null;
        this.formName = formName;
        this._validators = [];
        this.onInit();
    } 

    onInit() {
        this.registerValidators();
        this.prioritizeValidators();
        this.subscribe();
        this.listener();
       
    }

    subscribe() {
        this.subCBSuccess = pubSub.subscribe('field:callbackSuccess', this.callbackSuccess.bind(this));   
        this.subCBError = pubSub.subscribe('field:callbackError', this.callbackError.bind(this));
        this.subCBIgnore = pubSub.subscribe('field:callbackIgnore', this.callbackIgnore.bind(this));       
    }

    callbackSuccess(obj) {
 
        if(this.uniqueId === obj.uniqueId) {
            this.clearError();
            this.enable();
        }
    }

    callbackError(obj) {
         
        if(this.uniqueId === obj.uniqueId) {     
            this.enable();
            this.showError(obj.key);
            this.fieldState = validatorState.ERROR;
        }
    }

     callbackIgnore(obj) {
         
        if(this.uniqueId === obj.uniqueId) {     
            this.enable();
        }
    }

    // Only pass in info you need and don't pass by reference.
    // Bug fix - Add change to the event list for copy and paste fields.
    listener() {
       this._fieldElem.addEventListener('keyup', this.validate.bind(this), false);
    }

    disable() {
      this._fieldElem.disabled = true;
    }
 
    enable() {
       this._fieldElem.disabled = false;
    }

    validate() { 
       
        this.fieldValue = this._fieldElem.value;
        this.fieldState = fieldState.WAIT;
         for(let validator of this._validators) {
             validator.validate(this.fieldValue);
             if(validator.state === validatorState.ERROR) {
                this.showError(validator.key);
                this.fieldState = fieldState.ERROR;
                return;
             } else if (validator.state === validatorState.HANDSHAKE) {
                this.disable();
                this.clearError();
                this.fieldState = fieldState.HANDSHAKE;
                pubSub.publish('handshake:execute', { 
                    key: validator.key,
                    fieldName: this.fieldName,
                    fieldValue: this.fieldValue,
                    uniqueId: self.uniqueId
                });
                return;
             }
         }   
        this.fieldValidator = validator;
        this.fieldState = fieldState.SUCCESS;
        this.clearError();
    }

    registerValidators() {
        let self = this,
            attribute = null,
            regex = new RegExp(fieldQuery.prefix, 'i');

        nl2arr(this._fieldElem.attributes).forEach((attr) => {
            if( attr.name && regex.test(attr.name) && attr.specified) {
                attribute = attr.name.slice(attributes.prefix.length);
            } else if (attr.name === 'required' && attr.specified) {
                attribute = 'required';
            } else {
                attribute = null;
            }
          
            if(attribute) {
                self._validators.push(new Validator(attribute, attr.value, this.fieldName, this.uniqueId));
            } 
           
        });
    }

    prioritizeValidators() {
        if(this._validators.length) {
            this._validators.sort((a, b) =>  b.priority - a.priority);
        }
    }
 

    showError(key) {
        pubSub.publish('messages:show', {
            fieldName: this.fieldName,
            formName: this.formName,
            key: key
        });
    }

    clearError() {
        pubSub.publish('messages:clear', {
            fieldName: this.fieldName,
            formName: this.formName
        });
    }

    destroy() {
        this._fieldElem.removeEventListener('keyup', this.validate.bind(this), false);
        this.subCBSuccess.remove();
        this.subCBError.remove();
        this._fieldElem = null;
        this._validators.length = 0;
    }

}

 
class Gator { 
 
    constructor() { 
        var elem = document.getElementById('customerForm');
        var handshake = Handshake;  
        var elemForm = new Form(elem);

        this.handShakes = {}; 
    } 

    handshake(topic, fn) {
        this.handShakes[topic] = fn;
        return this;
    }
  
}

 


class field {

    constructor(uniqueId) {
        this.uniqueId = uniqueId;
        this.value = null;
        this.ready = false;
    }

    isType(type) {
        return rules.type.fn.call({params: [type]},this.value);
    }

}

// This is an Event Loop
class Handshake {

    constructor() {
        this._handshakes = {};
        this.init();
        window.hs = this._handshakes;
    }
 
    init() {
        this.subscribe();
    }

    subscribe() {
        this.subRegister = pubSub.subscribe('handshake:register', this.register.bind(this));
        this.subExecute = pubSub.subscribe('handshake:addField', this.addField.bind(this)); 
        this.subExecute = pubSub.subscribe('handshake:execute', this.execute.bind(this)); 
        this.subReset = pubSub.subscribe('handshake:reset', this.reset.bind(this)); 
    }

    register(obj) {
        if(!this._handshakes.hasOwnProperty(obj.key)) {
            this._handshakes[obj.key] = {
                fields: {},
                key: obj.key
            }; 
        }
    }

    addField(obj) {
        this.register(obj);
        this._handshakes[obj.key].fields[obj.fieldName] =  new field(obj.uniqueId);
    }

    setFieldReady(key, fieldName, value) {
        let field = this._handshakes[key].fields[fieldName];
        field.value = value;
        field.ready = true;
    }

    fieldsReady(key) {
        let fields = this._handshakes[key].fields;
        for(let field in fields)  {
            if(fields.hasOwnProperty(field)) {
                if(!fields[field].ready) {
                    return false;
                }
            }
        }
        return true;
    } 

    execute(obj) {
        // Update Field
        this.setFieldReady(obj.key, obj.fieldName, obj.fieldValue);
        // Are all fields in handshake mode?
        if(this.fieldsReady(obj.key) || !rules[obj.key].required) {
                // Execute Function
                rules[obj.key].fn(this._handshakes[obj.key].fields,
                                this.callback.bind(this._handshakes[obj.key], 'field:callbackSuccess'),  
                                this.callback.bind(this._handshakes[obj.key], 'field:callbackError'),
                                this.callback.bind(this._handshakes[obj.key], 'field:callbackIgnore'));
        }
    }

    callback(event) {
          for(let field in this.fields) {
            if(this.fields.hasOwnProperty(field)) {
                pubSub.publish(event, {
                    uniqueId: this.fields[field].uniqueId,
                    key: this.key
                }); 
            }
        }
    }

    reset() {

    }

    destroy() {
        this.subRegister.remove();
        this.subExecute.remove();
        this.subExecute.remove();
        this.subReset.remove();
    }
}

 
class Messages {

    constructor(msgsElem) {
        this._msgsElem = msgsElem;
        this._messages = {};
        this.formName = null;
        this.fieldName = null;
        this.onInit();
    }

    onInit() {
        let attrs = this._msgsElem.getAttribute(attributes.messages).split('.');
        this.formName = attrs[0];
        this.fieldName = attrs[1];
       
        this.register();
        this.hideAll();
        this.subscribe();
    }

    subscribe() {
        let self = this;
        this.subShow = pubSub.subscribe('messages:show', (obj) => {
            if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                self.hideAll();
                self.show(obj.key);
            }
        });

        this.subClear = pubSub.subscribe('messages:clear', (obj) => {
            if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                self.hideAll();
            }
        });

        this.subDestroy = pubSub.subscribe('messages:destroy', (obj) => {
            self.destroy();
        });
    }

    // register internal messages.
    register() {
        let self = this;
        nl2arr(this._msgsElem.querySelectorAll(fieldQuery.message))
                .forEach((msgElem)  => {
                    let key = msgElem.getAttribute(attributes.message);
                    if (key) {
                        self._messages[key] = msgElem; 
                    }  
                }); 
    }

    show(key) { 
        this.validateKey(key);
        this._messages[key].style.display = 'block';
    }

    hideAll() {
        let messages = this._messages;
        for(let key in messages ) {
            this.validateKey(key);
            messages[key].style.display = 'none';
        }
    }

    validateKey(key) {
         if (!this._messages.hasOwnProperty(key)) {
             throw new Error(`Missing "gt-${key} in gt-messages="${this.formName}.${this.fieldName}"`);
         }
    }

    destroy() {
        this._elem = null;
        this._messages.length = 0;
        this.subShow.remove();
        this.subClear.remove();
        this.subDestroy.remove();
    }
}

let pubSub = (() => {

  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function(topic, listener) {
      // Create the topic's object if not yet created
      if(!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    },
    publish: function(topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if(!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function(item) {
      		item(info != undefined ? info : {});
      });
    }
  };
})();

export function getUniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

 

 
class Validator { 
 
    constructor(key, params, fieldName, fieldUniqueId) { 
        this.key = key;
        this.fieldName = fieldName;
        this.fieldUniqueId = fieldUniqueId;
        this.state = validatorState.INIT;
        this.params = params.length ? params.split(',') : [];
        this.onInit();
    } 

    onInit() {
        this.setPriority();
        this.setHandshake();
    }

    setPriority() {
        if (!rules.hasOwnProperty(this.key)) {
            throw new Error(`Invalid directive, "gt-${this.key}"`);
        }
        this.priority = rules[this.key].priority;
    } 

    setHandshake() {
        let self = this;
        if(rules[this.key].handshake) {
            pubSub.publish('handshake:addField', { 
                key: self.key,
                fieldName: self.fieldName,
                uniqueId: self.fieldUniqueId
            });
        }
    }

	validate(value) {
        let self = this,
            rule = rules[this.key];
        if(rule.handshake === true) {
            this.state = validatorState.HANDSHAKE;
        } else {
            this.state = rule.fn.call(this, value) ? validatorState.SUCCESS : validatorState.ERROR;
        }   
    } 

    destroy() {
        this.params.length = 0;
    }
}

 