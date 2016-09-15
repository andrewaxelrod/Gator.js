import {rules} from './config';

class Validator { 
 
    constructor(key, params) { 
        this.key = key;
        this.params = params.split(',');
        this.priority = rules[key].priority;
    } 

	isValid(value) {
         return rules[this.key].fn.call(this, value);
    } 
}

module.exports = Validator;
