import {pubSub} from "./utils";
import FormField from './form-field';
import {rules, objType, fieldState} from "./config.js";

// This is an Event Loop
class Handshake {

    constructor() {
        this._handshakes = {};
        this.init();
    }
 
    init() {
        this.subscribe();
    }

    subscribe() {
        this.subRegister = pubSub.subscribe('handshake:register', this.register.bind(this, obj));
        this.subExecute = pubSub.subscribe('handshake:addField', this.addField.bind(this, obj)); 
        this.subExecute = pubSub.subscribe('handshake:execute', this.execute.bind(this, obj)); 
        this.subReset = pubSub.subscribe('handshake:reset', this.reset.bind(this, obj)); 
    }

    register(obj) {
        if(!_handshakes.hasOwnProperty(obj.key)) {
            this._handshakes[obj.key] = {
                fields: {},
                key: obj.key
            }; 
        }
    }

    addField(obj) {
        this.register(obj);
        this._handshakes[obj.key].fields[obj.fieldName] = {
            uniqueId: obj.uniqueId,
            value: obj.fieldValue,
            ready: false
        };
    }

    setFieldReady(key, fieldName, value) {
        let field = this._handshakes[key].fields[fieldName];
        field.value = value;
        field.ready = true;
    }

    fieldsReady(key) {
        let fields = this._handshakes[key].fields;
        for(let field in fields)  {
            if(fields.hasOwnProperty(field)) {
                if(!field.ready) {
                    return false;
                }
            }
        }
        return true;
    }

    execute(obj) {
        // Update Field
        this.setFieldReady(obj.key, obj.fieldName, obj.fieldvalue);
        // Are all fields in handshake mode?
        if(this.fieldsReady(obj.key)) {
                // Execute Function
                rules[obj.key].fn(this._handshakes[key]._handshake,  
                                this.callback.bind(this._handshakes[obj.key], 'field:callbackSuccess'),  
                                this.callback.bind(this._handshakes[obj.key], 'field:callbackError'));
        }
    }

    callback(event) {
          for(let field in this.fields) {
            if(this.fields.hasOwnProperty(field)) {
                pubSub.publish(event, {
                    uniqueId: fields.uniqueId,
                    key: this.key
                }); 
            }
        }
    }

    reset() {

    }

    destroy() {
        this.subRegister.remove();
        this.subExecute.remove();
        this.subExecute.remove();
        this.subReset.remove();
    }
}

module.exports = new Handshake;