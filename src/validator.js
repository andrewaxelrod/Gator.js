import {Rules, ValidatorState, Events} from './config';
import {pubSub} from './utils'; 

class Validator { 
 
    constructor(key, params, fieldName, fieldUniqueId) { 
        this.key = key;
        this.fieldName = fieldName;
        this.fieldUniqueId = fieldUniqueId;
        this.state = ValidatorState.INIT;    

        let p = params.match(/^(.*?)(?:\:(\w*)){0,1}$/);
        this.params = p[1] ? p[1].split(',') : null;
        this.event = p[2] || Events.KEYUP;
        this.onInit(); 
    } 

    onInit() {
        this.setPriority();
        this.setHandler();
        this.subscribe();
    }

    subscribe() {
        this.subCBDestroy = pubSub.subscribe('validator:destroy', this.destroy.bind(this));        
    }

    setPriority() {
        if (!Rules.hasOwnProperty(this.key)) {
            throw new Error(`Invalid directive, "gt-${this.key}"`);
        }
        this.priority = Rules[this.key].priority;
    } 
 
    setHandler() {
        let self = this;
        if(Rules[this.key].handler) {
            pubSub.publish('handler:addField', { 
                key: self.key,
                fieldName: self.fieldName,
                uniqueId: self.fieldUniqueId
            });
        }
    }

	validate(value) {
        let self = this,
            rule = Rules[this.key];
        if(rule.handler === true) {
            this.state = ValidatorState.HANDLER;
        } else {
            this.state = rule.fn.call(this, value) ? ValidatorState.SUCCESS : ValidatorState.ERROR;
        }   
    } 

    isHandler() {
        return this.state === ValidatorState.HANDLER;
    }

    isError() {
        return this.state === ValidatorState.ERROR;
    }

    destroy() {
        console.log('valdidator is destroyed!')
        this.params.length = 0;
        this.subCBDestroy.remove();
    }
}

module.exports = Validator;
