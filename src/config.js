 
export const priorityDefault = 30;

export const appPrefix = 'gt';

export const  fieldQuery = {
      prefix: `^${appPrefix}`,
      input: 'input[required]:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
      select: ',select[required]:not(:disabled):not([readonly])',
      textarea: ',textarea[required]:not(:disabled):not([readonly])',
      messages: `[${appPrefix}-messages]`,
      message: `[${appPrefix}-message]`
};

export const attributes = {
    prefix: `${appPrefix}-`,
    messages: `${appPrefix}-messages`,
    message: `${appPrefix}-message`
}

export const ruleTypes = {
    email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    integer: /^-?\d+$/,
    digits: /\d+$/,
    alphanum: /^\w+$/i,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
}

export const rules = { 
    required: {
        fn: function(value) {
          return (/\S/.test(value));
        },
        priority: 1024
      },
      remote: { 
        fn: function(value) {  },
        priority: -100
      },
      type: {
        fn: function(value) {
          var regex = ruleTypes[this.params[0]];
          return regex.test(value);
        },
        priority: 256
      },
      minlength: {
        fn: function(value) {
           return value.length >= this.params[0]
        },
        priority: 512
      },
      maxlength: {
        fn: function(value) {
           return value.length <= this.params[0]
        },
        priority: 512
      },
      handshake: {
          fn: function(value) {
          },
          priority: 0
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

export const objType = {
    FIELD: 0,
    FORM: 1,
    MESSAGE: 2 
};


 