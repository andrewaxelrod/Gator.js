import {objType, fieldState, validatorState, attributes, fieldQuery} from "./config.js";
import {getUniqueId, nl2arr, pubSub} from "./utils.js";
import Validator from "./validator"

class FormField { 
 
    constructor(fieldElem, formName) { 
        this.uniqueId = getUniqueId();
        this.objType = objType.FIELD;
        this.fieldState = fieldState.INIT;
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
    }

    callbackSuccess(obj) {
        if(this.uniqueId === obj.uniqueId) {
            this.clearError();
        }
    }

    callbackError(obj) {
        if(this.uniqueId === obj.uniqueId) {
            this.showError(obj.key);
        }
    }

    // Only pass in info you need and don't pass by reference.
    // Bug fix - Add change to the event list for copy and paste fields.
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
        this.fieldState = fieldState.WAIT;
         for(let validator of this._validators) {
             validator.validate(this.fieldValue);
             if(validator.state === validatorState.ERROR) {
                this.showError(validator.key);
                this.fieldState = fieldState.ERROR;
                return;
             } else if (validator.state === validatorState.HANDSHAKE) {
                this.clearError();
                this.fieldState = fieldState.HANDSHAKE;
                return;
             }
         }   
        this.fieldValidator = validator;
        this.fieldState = fieldState.SUCCESS;
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
                self._validators.push(new Validator(attribute, attr.value), this.fieldName, this.uniqueId);
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
