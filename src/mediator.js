import {Type, STATE} from "./config";

class Mediator { 
 
    constructor() { 
        this._fields = {},
        this._forms = {},
        this._messages = {},
        this._validator = null;
    }

    register(obj) {
        switch(obj.type) {
            case Type.FORM:
                this._forms[obj.key] = obj;
                this._forms[obj.key].mediator = this;
                break;
            case Type.FIELD:
                this._fields[obj.key] = obj;
                this._fields[obj.key].mediator = this;
                this._fields[obj.key].init();
                break;
            case Type.MESSAGE:
                this._messages[obj.key] = obj;
                this._messages[obj.key].mediator = this;
                this._messages[obj.key].init();
                break;
        }
    }

    registerValidator(obj) {
        this._validator = obj; 
        this._validator.mediator = this;
    }

    validate(field) {
       this._validator.validate(field.validators, field.key, field.value);
    }

    validateResponse(state, fieldKey, validatorKey) {
        this._messages[fieldKey].clear();
        if(state === STATE.ERROR) {
            this._messages[fieldKey].showMessage(validatorKey);
        }
    }

    // Pass in field.validators instead of field
    initValidators(validators, key) {
        this._validator.initValidators(validators, key);
       
    }

    destroy() {
 
    }
}

module.exports = new Mediator();
