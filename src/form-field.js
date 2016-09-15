import {appPrefix} from "./config.js";
import {nl2arr, pubSub} from "./utils.js";
import Validator from "./validator"

class FormField { 
 
    constructor(parent, elem) { 
       this.parent = parent;
       this.elem = elem;
       this.name = this.elem.getAttribute("name");
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

        this.subscription = pubSub.subscribe('validate:field', (form) => {
           if(form === this.parent) {
                self.valdate();
           }
        });
    }

    listener() {
        this.elem.addEventListener('keyup', () => {
            this.validate();
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
        this.valid = true;
        this.validatorKey = null;
        
        for(let validator of this.validators) {
            if(!validator.isValid(value)) {
                this.valid = false;
                this.validatorKey = validator.key;
                pubSub.publish('messages:show', 
                    {
                        fieldName: this.name,
                        formName: this.parent.name,
                        key: validator.key
                    } 
                );
                break;
            }
        }
        
        if(this.valid) {
            pubSub.publish('messages:clear', 
                {
                    fieldName: this.name,
                    formName: this.parent.name
                } 
            );
        }
    }

    destroy() {
        this.subscription.remove();
    }

}

module.exports = FormField;
