import {pubSub} from "./utils";
import FormField from './form-field';
import {fieldMethods, rules, objType, fieldState} from "./config.js";

class fieldWrapper {

    constructor(uniqueId) {
        this.uniqueId = uniqueId;
        this.value = null;
        this.ready = false;
    }

    isType(type) {
        return rules.type.fn.call({params: [type]},this.value);
    }
}

class Handshake {

    constructor() {
        this._handshakes = {};
        this.onInit();
    }
 
    onInit() {
        this.subscribe();
    }

    subscribe() {
        this.subRegister = pubSub.subscribe('handshake:register', this.register.bind(this));
        this.subAddField = pubSub.subscribe('handshake:addField', this.addField.bind(this)); 
        this.subExecute = pubSub.subscribe('handshake:execute', this.execute.bind(this)); 
        this.subDestroy = pubSub.subscribe('handshake:destroy', this.destroy.bind(this)); 
    }

    register(obj) {
        if(!this._handshakes.hasOwnProperty(obj.key)) {
            this._handshakes[obj.key] = {
                fields: {},
                key: obj.key
            }; 
        }
    }

    addField(obj) {
        this.register(obj);
        this._handshakes[obj.key].fields[obj.fieldName] =  new fieldWrapper(obj.uniqueId);
    }

    setFieldReady(key, fieldName, value) {
        let field = this._handshakes[key].fields[fieldName];
        field.value = value;
        field.ready = true;
    }

    checkFieldsReady(key) {
        let fields = this._handshakes[key].fields;
        for(let field in fields)  {
            if(fields.hasOwnProperty(field)) {
                if(!fields[field].ready) {
                    return false;
                }
            }
        }
        return true;
    } 

    disableFields(key) {
        let fields = this._handshakes[key].fields;
        for(let field in fields)  {
            if(fields.hasOwnProperty(field)) {
               pubSub.publish('field:disable', {
                    uniqueId: fields[field].uniqueId
                });
            }
        }
    }

    execute(obj) {
        let required = rules[obj.key].hasOwnProperty('required')  ? rules[obj.key].required : false;
        this.setFieldReady(obj.key, obj.fieldName, obj.fieldValue);
        if(this.checkFieldsReady(obj.key) || !required) {
            this.disableFields(obj.key);
            // Execute Function
            rules[obj.key].fn(this._handshakes[obj.key].fields,
                this.callback.bind(this._handshakes[obj.key], 'field:callbackSuccess'),  
                this.callback.bind(this._handshakes[obj.key], 'field:callbackError'),
                this.callback.bind(this._handshakes[obj.key], 'field:callbackIgnore'));
        }
    }

    callback(event) {
          for(let field in this.fields) {
            if(this.fields.hasOwnProperty(field)) {
                pubSub.publish(event, {
                    uniqueId: this.fields[field].uniqueId,
                    key: this.key
                }); 
            }
        }
    }

    destroy() {
        console.log('handshake is destroyed.');
        this._handshakes = null;
        this.subRegister.remove();
        this.subAddField.remove();
        this.subExecute.remove();
        this.subDestroy.remove();
    }
}

module.exports = Handshake;