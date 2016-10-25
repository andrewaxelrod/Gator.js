import {NAMESPACE_PREFIX, Type, Event, State} from "./config";
import * as util from "./utils";

const ATTR_REQUIRED = 'required',
      ATTR_REGEX = /^(.*?)(?:\:(\w*)){0,1}$/;

class Field { 
 
    constructor(key, elem) { 
        this.type = Type.FIELD;
        this.state = State.INIT;
        this.key = key || null;
        this.elem = elem || null;
        this.name = elem.name || null;
        this.value = null;
        this.validators = [];
        this.mediator = null;
    } 

    init() {    
        this.registerListeners();
        this.getValidators();
        this.initValidators();
    }

    registerListeners() {
        this.elem.addEventListener(Event.KEYUP, this, false);
        this.elem.addEventListener(Event.CHANGE, this, false);
    }

    handleEvent(event) {
        this.value = this.elem.value;

        switch(event.type) {
            case Event.CHANGE:
                this.validate(Event.CHANGE);
                break;
            case Event.KEYUP:
                this.validate(Event.KEYUP);
                break;
        }
    }

    getValidators() {
        let self = this,
            regex = new RegExp(NAMESPACE_PREFIX, 'i');

        util.nl2arr(this.elem.attributes).forEach((attr) => {
            let attribute = null;
            
            if( attr.name && regex.test(attr.name) && attr.specified) {
                attribute = attr.name.slice(NAMESPACE_PREFIX.length);
            } else if (attr.name === ATTR_REQUIRED && attr.specified) {
                attribute = ATTR_REQUIRED;
            }  

            if(attribute) {
              let p = attr.value.match(ATTR_REGEX);
                this.validators.push({
                    key: util.convertCamelCase(attribute),
                    params: p[1] ? p[1].split(',') : null,
                    event: p[2] || Event.KEYUP 
                });
            } 
        });
    }

    initValidators() {
        this.mediator.initValidators(this.validators, this.key);
    }

    validate(event) {
        this.mediator.validate(event, this.validators, this.key, this.value, this.state);
    }

    onSuccess() {
        this.state = State.SUCCESS;
        this.elem.disabled = false;
    }

    onError() {
        this.state = State.ERROR;
        this.elem.disabled = false;
    }

    onAsync() {
        this.state = State.ASYNC;
        this.elem.disabled = true;
    }

    destroy() {
        this.elem.removeEventListener(Event.KEYUP, this, false);
        this.elem.removeEventListener(Event.CHANGE, this, false);
        this.elem = null;
        this.validators.length = 0;
        this.mediator = null;
    }

}

module.exports = Field;
