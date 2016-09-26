
export const PREFIX = 'gt';

export const PRIORITY_DEFAULT = 30;

export const ValidatorState = {
    INIT: 0,
    WAIT: 1,
    SUCCESS: 2,
    ERROR: 4,
    HANDLER: 5
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
        priority: 1024,
        handler: false
      }, 
      type: {
        fn: function(value) {
          var regex = RuleTypes[this.params[0]];
          return regex.test(value);
        },
        priority: 256,
        handler: false
      }, 
      minlength: {
        fn: function(value) {
           return value.length >= this.params[0]
        },
        priority: 512,
        handler: false
      },
      maxlength: {
        fn: function(value) {
           return value.length <= this.params[0]
        },
        priority: 512,
        handler: false
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
        handler: true,
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
        handler: true,
        required: true // All fields must pass all initial validators up until the handler or won't be called.
      }
};
 
