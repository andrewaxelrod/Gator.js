
export const PREFIX = 'gt';

export const PRIORITY_DEFAULT = 30;

export const Type = {
    FORM: 0,
    FIELD: 1,
    MESSAGE: 2,
    VALIDATOR: 4,
};

export const STATE = {
    INIT: 'INIT',
    WAIT: 'WAIT',
    SKIP: 'SKIP',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR' 
};

export const Events = {
    KEYUP: 'keyup',
    CHANGE: 'change' 
};

export const  FieldQuery = {
      prefix: `^${PREFIX}`,
      input: 'input:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
      select: ',select[required]:not(:disabled):not([readonly])',
      textarea: ',textarea[required]:not(:disabled):not([readonly])',
      form: `form[name="{{name}}"]`,
      messages: `[${PREFIX}-messages]`,
      message: `[${PREFIX}-message]`
};

export const Attributes = {
    prefix: `${PREFIX}-`,
    messages: `${PREFIX}-messages`,
    message: `${PREFIX}-message`
};


export const RULE_TYPES = {
    email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    integer: /^-?\d+$/,
    digits: /\d+$/,
    alphanum: /^\w+$/i,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
};

export const RULES = { 
     required: {
        fn: function(value) {
          return (/\S/.test(value));
        },
        priority: 1024
      }, 
      type: {
        fn: function(value) {
          let regex = RULE_TYPES[this.params[0]];
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
      same: {
        fn: function(fields) {
          let ref = fields[Object.keys(fields)[0]];
          for(let field in fields) {
             if(fields[field] !== ref) {
                return false; 
             }
          }
          return true;
        },
        priority: 0,
        group: true
      }
};
 