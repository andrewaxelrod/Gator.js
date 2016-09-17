import {rules} from './config';

class Validator { 
 
    constructor(key, params) { 
        this.key = key;
        this.params = params.length ? params.split(',') : [];
        this.onInit();
    } 

    onInit() {
        this.setPriority();
    }

    setPriority() {
        if (!rules.hasOwnProperty(this.key)) {
            throw new Error(`Invalid directive, "gt-${this.key}"`);
        }
        this.priority = rules[this.key].priority;
    }

	isValid(value) {
        console.log(this.key);
         return rules[this.key].fn.call(this, value);
    } 

    destroy() {
        this.params.length = 0;
    }
}

module.exports = Validator;
