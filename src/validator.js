import {rules, validatorState, Events} from './config';
import {pubSub} from './utils'; 

class Validator { 
 
    constructor(key, params, fieldName, fieldUniqueId) { 
        this.key = key;
        this.fieldName = fieldName;
        this.fieldUniqueId = fieldUniqueId;
        this.state = validatorState.INIT;    

        let p = params.match(/^(.*?)(?:\:(\w*)){0,1}$/);
        this.params = p[1] ? p[1].split(',') : null;
        this.event = p[2] || Events.KEYUP;
        this.onInit(); 
    } 

    onInit() {
        this.setPriority();
        this.setHandshake();
        this.subscribe();
    }

    subscribe() {
        this.subCBDestroy = pubSub.subscribe('validator:destroy', this.destroy.bind(this));        
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

    isHandshake() {
        return this.state === validatorState.HANDSHAKE;
    }

    isError() {
        return this.state === validatorState.ERROR;
    }

    destroy() {
        console.log('valdidator is destroyed!')
        this.params.length = 0;
        this.subCBDestroy.remove();
    }
}

module.exports = Validator;
