import {rules, validatorState} from './config';
import {pubSub} from './utils'; 

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

module.exports = Validator;
