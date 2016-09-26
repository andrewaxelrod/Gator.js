import {FieldQuery, RuleTypes, Rules} from './config';
import {nl2arr, pubSub} from "./utils.js";
import Form from './form';
import Message from './messages';
import Handler from './handler';

class Main { 
 
    constructor(formName) {  
        this._messages = []; 
        this._forms = [];
        this._handler = null;
    }

    _init(formName) {
        this._handler = new Handler();
        this._registerMessages();
        this._registerForm(formName);
    }

    _registerForm(formName) {
        let query = formName ? FieldQuery.form.replace(/\{\{name\}\}/, formName) : 'form';
        nl2arr(document.querySelectorAll(query))
            .forEach((formElem)  => {
                this._forms.push(new Form(formElem));
            });  
    }

    _registerMessages() {
        nl2arr(document.querySelectorAll(FieldQuery.messages))
            .forEach((msgElem)  => {
                this._messages.push(new Message(msgElem));
            });  
    }

    _destroy() {
        console.log('main is destroyed');
        pubSub.publish('field:destroy', {});
        pubSub.publish('messages:destroy', {});
        pubSub.publish('handler:destroy', {});
        pubSub.publish('form:destroy', {});
        pubSub.publish('validator:destroy', {});
        this._messages.length = 0;
        this._forms.length = 0;
        this._handler = null;
    }
}

class Gator extends Main {

    constructor() {
        super();
    }

    addRuleType(type, exp) {
        if(!exp instanceof RegExp)  {
            throw new Error(`${exp} must be a regular expression`);
        }
        if(RuleTypes.hasOwnProperty(type))  {
            throw new Error(`${type} already exists as a rule type`);
        }
         if(typeof type !== 'string')  {
            throw new Error(`${type} must be a string.`);
        }
        RuleTypes[type] = exp;
        return this;

    }

    validator(key, fn, required, priority) {
        // TO-DO: Check for correct parameters
        Rules[key] = { 
            fn: fn,
            priority: priority || 0,
            handler: true,
            required: required || false
        }
        return this;
    }

    destroy() {
        this._destroy();
        return this;
    }

    init(formName) {
       this._init(formName);
       return this;
    }
}

module.exports = Gator;
 