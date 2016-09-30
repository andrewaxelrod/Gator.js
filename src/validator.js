const RuleTypes = {
    email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
    number: /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
    integer: /^-?\d+$/,
    digits: /\d+$/,
    alphanum: /^\w+$/i,
    date: /^(\d{4})-(\d{2})-(\d{2})$/,
    url: /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
};

const Rules = { 
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
 

class Validator { 
 
    constructor() { } 



    prioritize(validators) {
        for(let validator of validators) {
            if(isRule(validator.key)) {
                validator.priority = Rules[validator.key].priority; 
            }
        }
        validators.sort((a, b) =>  b.priority - a.priority);
    }

    isRule(key) {
        return Rules.hasOwnProperty(key);
    }

    isRuleType(key) {
        return RuleTypes.hasOwnProperty(key);
    }
}

module.exports = new Validator();
