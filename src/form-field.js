import {fieldState, appPrefix} from "./config.js";
import {getUniqueId, nl2arr, pubSub} from "./utils.js";
import Validator from "./validator"

class FormField { 
 
    constructor(formElem, fieldElem) { 
       this.uniqueId = getUniqueId();
       this.form = formElem;
       this.elem = fieldElem;
       this.state = fieldState.INIT;
       this.fieldName = this.elem.getAttribute("name");
       this.formName = formElem.name;
       this.validators = [];
       this.valid = true;
       this.validatorKey = null;
       this.onInit();


    } 

    onInit() {
        let self = this;
        this.registerValidators();
        this.prioritizeValidators();
        this.listener();
        this.subscribe();
       
    }

    subscribe() {
        let self = this;
        this.subscription = pubSub.subscribe('validate:field', (uniqueId) => {
            // Determines if this is the field to be validated.
            if(uniqueId === this.uniqueId) {
                self.validate();
            }
        });
    }

    listener() {
        let self = this;
        this.elem.addEventListener('keyup', () => {
            pubSub.publish('coordinate', self);
        });
    }

    registerValidators() {
        let self = this,
            attribute = null,
            regex = new RegExp(`^${appPrefix}`, 'i');

        nl2arr(this.elem.attributes).forEach((attr) => {
            if( attr.name && regex.test(attr.name) && attr.specified) {
                attribute = attr.name.slice(appPrefix.length);
            } else if (attr.name === 'required' && attr.specified) {
                attribute = 'required';
            } else {
                attribute = null;
            }
            if(attribute) {
                self.validators.push(new Validator(attribute, attr.value));
            } 
           
        });
    }

    prioritizeValidators() {
        if(this.validators.length) {
            this.validators.sort((a, b) =>  b.priority - a.priority);
        }
    }

    validate() {

        let value = this.elem.value;
        this.state = fieldState.WAIT;
        for(let validator of this.validators) {
            if(!validator.isValid(value)) {
                this.state = fieldState.ERROR;
                pubSub.publish('messages:show', 
                    {
                        fieldName: this.fieldName,
                        formName: this.formName,
                        key: validator.key
                    } 
                );
                break;
            }
        }

        if(this.state === fieldState.WAIT) {
            this.state = fieldState.SUCCESS;
            pubSub.publish('messages:clear', 
                {
                    fieldName: this.fieldName,
                    formName: this.formName
                } 
            );
        }
    }

    destroy() {
        this.subscription.remove();
    }

}

module.exports = FormField;
