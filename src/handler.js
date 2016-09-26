import {pubSub} from "./utils";
import FormField from './form-field';
import {fieldMethods, Rules, fieldState} from "./config.js";

class fieldWrapper {

    constructor(uniqueId) {
        this.uniqueId = uniqueId;
        this.value = null;
        this.ready = false;
    }

    isType(type) {
        return Rules.type.fn.call({params: [type]},this.value);
    }
}

class Handler {

    constructor() {
        this._handlers = {};
        this.onInit();
    }
 
    onInit() {
        this.subscribe();
    }

    subscribe() {
        this.subRegister = pubSub.subscribe('handler:register', this.register.bind(this));
        this.subAddField = pubSub.subscribe('handler:addField', this.addField.bind(this)); 
        this.subExecute = pubSub.subscribe('handler:execute', this.execute.bind(this)); 
        this.subDestroy = pubSub.subscribe('handler:destroy', this.destroy.bind(this)); 
    }

    register(obj) {
        if(!this._handlers.hasOwnProperty(obj.key)) {
            this._handlers[obj.key] = {
                fields: {},
                key: obj.key
            }; 
        }
    }

    addField(obj) {
        this.register(obj);
        this._handlers[obj.key].fields[obj.fieldName] =  new fieldWrapper(obj.uniqueId);
    }

    setFieldReady(key, fieldName, value) {
        let field = this._handlers[key].fields[fieldName];
        field.value = value;
        field.ready = true;
    }

    checkFieldsReady(key) {
        let fields = this._handlers[key].fields;
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
        let fields = this._handlers[key].fields;
        for(let field in fields)  {
            if(fields.hasOwnProperty(field)) {
               pubSub.publish('field:disable', {
                    uniqueId: fields[field].uniqueId
                });
            }
        }
    }

    execute(obj) {
        let required = Rules[obj.key].hasOwnProperty('required')  ? Rules[obj.key].required : false;
        this.setFieldReady(obj.key, obj.fieldName, obj.fieldValue);
        if(this.checkFieldsReady(obj.key) || !required) {
            this.disableFields(obj.key);
            // Execute Function
            Rules[obj.key].fn(this._handlers[obj.key].fields,
                this.callback.bind(this._handlers[obj.key], 'field:callbackSuccess'),  
                this.callback.bind(this._handlers[obj.key], 'field:callbackError'),
                this.callback.bind(this._handlers[obj.key], 'field:callbackIgnore'));
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
        console.log('handler is destroyed.');
        this._handlers = null;
        this.subRegister.remove();
        this.subAddField.remove();
        this.subExecute.remove();
        this.subDestroy.remove();
    }
}

module.exports = Handler;