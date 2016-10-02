import {Type, Events, FieldQuery, Attributes} from "./config";
import {nl2arr} from "./utils";

class Field { 
 
    constructor(key, elem, form) { 
        this.type = Type.FIELD;
        this.key = key || null;
        this.elem = elem || null;
        this.name = elem.name || null;
        this.formName = form.name || null;
        this.validators = [];
        this.value = null;
        this.mediator = null;
    } 

    init() {    
        this.listeners();
        this.getValidators();
        this.initValidators();
    }

    listeners() {
        this.elem.addEventListener(Events.KEYUP, this, false);
        this.elem.addEventListener(Events.CHANGE, this, false);
    }

    handleEvent(event) {
        this.value = this.elem.value;
        switch(event.type) {
            case Events.CHANGE:
                this.validate();
                break;
            case Events.KEYUP:
                this.validate();
                break;
        }
    }

    getValidators() {
        let self = this,
            regex = new RegExp(FieldQuery.prefix, 'i');

        nl2arr(this.elem.attributes).forEach((attr) => {
            let attribute = null;
            if( attr.name && regex.test(attr.name) && attr.specified) {
                attribute = attr.name.slice(Attributes.prefix.length);
            } else if (attr.name === 'required' && attr.specified) {
                attribute = 'required';
            }  

            if(attribute) {
              let p = attr.value.match(/^(.*?)(?:\:(\w*)){0,1}$/);
                this.validators.push({
                    key: attribute,
                    params: p[1] ? p[1].split(',') : null,
                    event: p[2] || Events.KEYUP 
                });
            } 
        });
    }

    initValidators() {
        this.mediator.initValidators(this.validators, this.key);
    }

    validate() {
        this.mediator.validate(this);
    }

    destroy() {
       
    }

}

module.exports = Field;
