import {Type} from "./config";

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
                console.log(obj);
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
                break;
        }
    }

    registerValidator(obj) {
        this._validator = obj;
    }

    validate(field) {
       
    }

    prioritizeValidators(field) {
        this._validator.prioritize(field.validators);
    }

    onError(field) {
       if (field.state === State.ASYNC) {

       } else if (field.state === State.ERROR) {

       } else if (field.state === State.SUCCESS) { 
           
       }
    }

   
 
    destroy() {
 
    }
}

module.exports = new Mediator();
