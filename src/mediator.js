import {Type, State, Event, Options} from "./config";

class Mediator { 
 
    constructor() { 
        this.fields = {},
        this.forms = {},
        this.messages = {},
        this.prestine = false;
        this.validator = null;
    }

    register(obj) {
        switch(obj.type) {
            case Type.FORM:
                this.forms[obj.key] = obj;
                this.forms[obj.key].mediator = this;
                this.forms[obj.key].init();
                break;
            case Type.FIELD:
                this.fields[obj.key] = obj;
                this.fields[obj.key].mediator = this;
                this.fields[obj.key].init();
                break;
            case Type.MESSAGE:
                this.messages[obj.key] = obj;
                this.messages[obj.key].mediator = this;
                this.messages[obj.key].init();
                break;
        }
    }

    registerValidator(obj) {
        this.validator = obj; 
        this.validator.mediator = this;
    }

    init() {
        this.validateAll();
        this.prestine = true;
    }

    validate(event, validators, fieldKey, fieldValue, state) {
       this.validator.validate(event, validators, fieldKey, fieldValue, state);
    }

    validateAll() {
        let field = null;
        
        for(let fieldKey in this.fields) {
            if(this.fields.hasOwnProperty(fieldKey)) {
                field = this.fields[fieldKey];
                this.validate(Event.KEYUP, field.validators, field.key, field.value || '', field.state);
            }
        }
    }

    validateResponse(state, fieldKey, validatorKey) {
        let formKey = fieldKey.split(':')[0]; 

        this.forms[formKey].onFieldStateChange(fieldKey, state);

        switch(state) { 
            case State.VALIDATING:
                break;
            case State.ASYNC:
                this.messages[fieldKey].clear();
                this.fields[fieldKey].onAsync();
                break;
            case State.ERROR:
                if(this.prestine) {
                    this.messages[fieldKey].showMessage(validatorKey);
                }
                this.fields[fieldKey].onError();
                break;
            case State.SUCCESS: 
                this.messages[fieldKey].clear();
                this.fields[fieldKey].onSuccess();
                break;
        }    
    }

    initValidators(validators, key) {
        this.validator.initValidators(validators, key); 
    }

    destroy() {
        this.forms = null;
        this.fields = null;
        this.messages = null;
        this.validator = null;
        this.mediator = null;
    }
}

module.exports = new Mediator();
