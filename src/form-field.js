import {objType, fieldState, validatorState, attributes, fieldQuery} from "./config.js";
import {getUniqueId, nl2arr, pubSub, convertCamelCase} from "./utils.js";
import Validator from "./validator"

class FormField { 
 
    constructor(fieldElem, formName) { 
        this.uniqueId = getUniqueId();
        this.objType = objType.FIELD;
        this.fieldState = validatorState.INIT;
        this._fieldElem = fieldElem;
        this.fieldName = fieldElem.getAttribute("name");
        this.fieldValue =  this._fieldElem.value;
        this.fieldValidator = null;
        this.formName = formName;
        this._validators = [];
        this.onInit();
    } 

    onInit() {
        this.registerValidators();
        this.prioritizeValidators();
        this.subscribe();
        this.listener();
       
    }

    subscribe() {
        this.subCBSuccess = pubSub.subscribe('field:callbackSuccess', this.callbackSuccess.bind(this));   
        this.subCBError = pubSub.subscribe('field:callbackError', this.callbackError.bind(this));
        this.subCBIgnore = pubSub.subscribe('field:callbackIgnore', this.callbackIgnore.bind(this));       
    }

    callbackSuccess(obj) {
        if(this.uniqueId === obj.uniqueId) {
            this.clearError();
            this.enable();
        }
    }

    callbackError(obj) { 
        if(this.uniqueId === obj.uniqueId) {     
            this.enable();
            if(this.fieldState !== validatorState.ERROR) {
                this.showError(obj.key); 
            }
        }
    }

     callbackIgnore(obj) {
        if(this.uniqueId === obj.uniqueId) {     
            this.enable();
        }
    }

    listener() {
       this._fieldElem.addEventListener('keyup', this.validate.bind(this), false);
    }

    disable() {
        this._fieldElem.disabled = true;
    }
 
    enable() {
        this._fieldElem.disabled = false;
    }

    validate() { 
        this.fieldValue = this._fieldElem.value;
        this.fieldState = validatorState.WAIT;
         for(let validator of this._validators) {
             validator.validate(this.fieldValue);
             if(validator.state === validatorState.ERROR) {
                this.showError(validator.key);
                this.fieldState = validatorState.ERROR;
                return;
             } else if (validator.state === validatorState.HANDSHAKE) {
                this.disable();
                this.clearError();
                this.fieldState = validatorState.HANDSHAKE;
                pubSub.publish('handshake:execute', { 
                    key: validator.key,
                    fieldName: this.fieldName,
                    fieldValue: this.fieldValue,
                    uniqueId: self.uniqueId
                });
                return;
             }
         }   
        // this.fieldValidator = validator;
        this.fieldState = validatorState.SUCCESS;
        this.clearError();
    }

    registerValidators() {
        let self = this,
            attribute = null,
            regex = new RegExp(fieldQuery.prefix, 'i');

        nl2arr(this._fieldElem.attributes).forEach((attr) => {
            if( attr.name && regex.test(attr.name) && attr.specified) {
                attribute = attr.name.slice(attributes.prefix.length);
            } else if (attr.name === 'required' && attr.specified) {
                attribute = 'required';
            } else {
                attribute = null;
            }

            if(attribute) {
                self._validators.push(new Validator(convertCamelCase(attribute), attr.value, this.fieldName, this.uniqueId));
            } 
        });
    }

    prioritizeValidators() {
        if(this._validators.length) {
            this._validators.sort((a, b) =>  b.priority - a.priority);
        }
    }
 
    showError(key) {
        pubSub.publish('messages:show', {
            fieldName: this.fieldName,
            formName: this.formName,
            key: key
        });
    }

    clearError() {
        pubSub.publish('messages:clear', {
            fieldName: this.fieldName,
            formName: this.formName
        });
    }

    destroy() {
        this._fieldElem.removeEventListener('keyup', this.validate.bind(this), false);
        this.subCBSuccess.remove();
        this.subCBError.remove();
        this._fieldElem = null;
        this._validators.length = 0;
    }

}

module.exports = FormField;
