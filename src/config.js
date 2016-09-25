
export const validatorState = {
    INIT: 0,
    WAIT: 1,
    SUCCESS: 2,
    ERROR: 4,
    HANDSHAKE: 5
};

export const Events = {
    KEYUP: 'keyup',
    CHANGE: 'change' 
};

export const objType = {
    FIELD: 0,
    FORM: 1,
    MESSAGE: 2 
};

export const PREFIX = 'gt';

export const  fieldQuery = {
      prefix: `^${PREFIX}`,
      input: 'input:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
      select: ',select[required]:not(:disabled):not([readonly])',
      textarea: ',textarea[required]:not(:disabled):not([readonly])',
      form: `form[name="{{name}}"]`,
      messages: `[${PREFIX}-messages]`,
      message: `[${PREFIX}-message]`
};

export const attributes = {
    prefix: `${PREFIX}-`,
    messages: `${PREFIX}-messages`,
    message: `${PREFIX}-message`
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

export const PRIORITY_DEFAULT = 30;

export const rules = { 
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
      group: {
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
        handshake: true,
        required: false
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
        handshake: true,
        required: false
      }
};
 
