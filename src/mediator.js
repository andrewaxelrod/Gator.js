import {Type, State} from "./config";

class Mediator { 
 
    constructor() { 
        this.fields = {},
        this.forms = {},
        this.messages = {},
        this.validator = null;
    }

    register(obj) {
        switch(obj.type) {
            case Type.FORM:
                this.forms[obj.key] = obj;
                this.forms[obj.key].mediator = this;
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

    validate(event, validators, fieldKey, fieldValue, state) {
       this.validator.validate(event, validators, fieldKey, fieldValue, state);
    }

    validateResponse(state, fieldKey, validatorKey) {
        switch(state) { 
            case State.VALIDATING:
                break;
            case State.ASYNC:
                this.messages[fieldKey].clear();
                this.fields[fieldKey].onAsync();
                break;
            case State.ERROR:
                this.messages[fieldKey].showMessage(validatorKey);
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
