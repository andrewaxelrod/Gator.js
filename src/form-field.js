import {objType, fieldState, validatorState, attributes, Events, fieldQuery} from "./config.js";
import {getUniqueId, nl2arr, pubSub, convertCamelCase} from "./utils.js";
import Validator from "./validator"

class FormField { 
 
    constructor(fieldElem, formName) { 
        this.uniqueId = getUniqueId();
        this.formName = formName;
        this._fieldElem = fieldElem;
        this.fieldName = fieldElem.getAttribute("name");
        this._validators = [];
        this.validatorIndex = 0;
        this.onInit();
    } 

    onInit() {  
        this.registerValidators();
        this.prioritizeValidators();
        this.subscribe();
        this.listeners();
       
    }

    handleEvent(event) {
        switch(event.type) {
            case Events.CHANGE:
                this.validatorLoop(Events.CHANGE);
                break;
            case Events.KEYUP:
                this.validatorIndex = 0;
                this.validatorLoop(Events.KEYUP);
                break;
        }
    }

    listeners() {
        this._fieldElem.addEventListener(Events.KEYUP, this, false);
        this._fieldElem.addEventListener(Events.CHANGE, this, false);
    }

    subscribe() {
        this.subCBSuccess = pubSub.subscribe('field:callbackSuccess', this.callbackSuccess.bind(this));   
        this.subCBError = pubSub.subscribe('field:callbackError', this.callbackError.bind(this));
        this.subCBDestroy = pubSub.subscribe('field:destroy', this.destroy.bind(this));        
    }

    callbackSuccess(obj) {
        if(this.uniqueId === obj.uniqueId) {
            this.enable();
            this.clearError();   
        }
    }

    callbackError(obj) {  
        if(this.uniqueId === obj.uniqueId) {     
           this.enable();
           if(this._validators[this.validatorIndex].state !== validatorState.ERROR) {
                this.showError(obj.key); 
            }  
        }
    }

    handshake(validatorKey, fieldValue) {
        pubSub.publish('handshake:execute', { 
            uniqueId: this.uniqueId,
            fieldName: this.fieldName,
            fieldValue: fieldValue,
            key: validatorKey
        });
    }

    validatorLoop(event) { 
        let fieldValue = this._fieldElem.value,
            validator = null,
            validators = this._validators; 

        for(let i = this.validatorIndex, len = this._validators.length; i < len; i++) {
             validator = validators[i];
             if(event === validator.event || validator.event === Events.KEYUP) {    
                this.validatorIndex = i;
                this.clearError();
                validator.validate(fieldValue);
                if(validator.isHandshake()) {
                    this.handshake(validator.key, fieldValue); 
                    return;
                } else if(validator.isError()) {
                    this.showError(validator.key);
                    return;
                }
            }
        }
        // SUCCESS STATE
       this.clearError();
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
 


    enable() {
        this._fieldElem.disabled = false;
    }

    disable() {
        this._fieldElem.disabled = true;
    }
 
    destroy() {
        console.log("fields are destroyed!");
        this._fieldElem.removeEventListener('keyup', this, false);
        this._fieldElem.removeEventListener('change', this, false);
        this._fieldElem = null;
        this._validators.length = 0;
        this.subCBSuccess.remove();
        this.subCBError.remove();
        this.subCBDestroy.remove();
    }

}

module.exports = FormField;
