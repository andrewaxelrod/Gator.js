import {objType, fieldState, attributes, fieldQuery} from "./config.js";
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
        let self = this;

        this.subFieldValidate = pubSub.subscribe('field:validate:all', (field) => {

            // Determines if this is the field to be validated.
            if (field.uniqueId === self.uniqueId) { 
                self.validate();
            } 
            
            // Async/Handshake Processing
            if (self.fieldState === fieldState.HANDSHAKE) {
                 console.log(self.fieldName + ' is in handshake mode.');
            }  

        });

        this.subFieldDestroy = pubSub.subscribe('field:destroy', (uniqueId) => {
            self.destroy();
        });
    }

    // Only pass in info you need and don't pass by reference.
    // Bug fix - Add change to the event list for copy and paste fields.
    listener() {
        this._fieldElem.addEventListener('change', this.publish.bind(this), false);
    }

    // Only pass in variables that you need. 
    publish() {
        pubSub.publish('field:validate:all', 
            {
                uniqueId: this.uniqueId,
                objType: this.objType,
                fieldName: this.fieldName,
                fieldState: this.fieldState,
                fieldValue: this.fieldValue,
                fieldValidator: this.fieldValidator
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
                self._validators.push(new Validator(attribute, attr.value));
            } 
           
        });
    }

    prioritizeValidators() {
        if(this._validators.length) {
            this._validators.sort((a, b) =>  b.priority - a.priority);
        }
    }

    validate() {

        this.fieldValue = this._fieldElem.value;
        this.fieldState = fieldState.WAIT;
        
        for(let validator of this._validators) {
            if(!validator.isValid(this.fieldValue)) {
                this.fieldValidator = validator;
                this.fieldState = validator.key === 'handshake' ? fieldState.HANDSHAKE : fieldState.ERROR;
                this.showError(validator.key);
                return;
            }
        }
        this.fieldValidator = validator;
        this.state = fieldState.SUCCESS;
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

    destroy() {
        this._fieldElem.removeEventListener('keyup', this.publish.bind(this), false);
        this.subFieldValidate.remove();
        this.subFieldDestroy.remove();
        this._fieldElem = null;
        this._validators.length = 0;
    }

}

module.exports = FormField;
