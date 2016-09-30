import {Type, Events, FieldQuery, Attributes} from "./config";
import {nl2arr} from "./utils";

class Field { 
 
    constructor(key, elem, name) { 
        this.type = Type.FIELD;
        this.key = key || null;
        this.elem = elem || null;
        this.name = elem.name || null;
        this.validators = [];
        this.mediator = null;
    } 

    init() {    
        this.listeners();
        this.getValidators();
        this.prioritizeValidators();
    }

    listeners() {
        this.elem.addEventListener(Events.KEYUP, this, false);
        this.elem.addEventListener(Events.CHANGE, this, false);
    }

    handleEvent(event) {
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

    prioritizeValidators() {
        this.mediator.prioritizeValidators(this);
    }

    validate() {
        this.mediator.validate(this);
    }

    destroy() {
       
    }

}

module.exports = Field;
