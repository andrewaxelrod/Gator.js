
/* Global Constants */

export const NAMESPACE = 'gt';
export const NAMESPACE_PREFIX = `${NAMESPACE}-`;
export const PRIORITY_DEFAULT = 30;

export const Type = {
    FORM: 'FORM',
    FIELD: 'FIELD',
    MESSAGE: 'MESSAGE',
    VALIDATOR: 'VALIDATOR',
};

export const State = {
    INIT: 'INIT',
    VALIDATING: 'VALIDATING',
    GROUP_NOT_READY: 'GROUP_NOT_READY',
    ASYNC: 'ASYNC',
    SKIP: 'SKIP',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR' 
};

export const Event = {
    KEYUP: 'keyup',
    CHANGE: 'change' 
};


export const RuleTypes = {
    email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    integer: /^-?\d+$/,
    digits: /\d+$/,
    alphanum: /^\w+$/i,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
};

export const Rules = { 
     required: {
        fn: function(value) {
          return (/\S/.test(value));
        },
        priority: 1024
      }, 
      type: {
        fn: function(value) {
          let regex = RuleTypes[this.params[0]];
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
      },
      test: {
        fn: (fields, success, error) => {
          window.setTimeout(() => {
              console.log('async function called');
                     error();
                }, 2000);
        },
        priority: 0,
        async: true
      }
};
 