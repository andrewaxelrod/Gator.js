import {fieldQuery, ruleTypes, rules} from './config';
import {nl2arr} from "./utils.js";
import Form from './form';
import Message from './messages';
import Handshake from './handshake';

class Main { 
 
    constructor() {  
        this._messages = []; 
        this._forms = [];
    }

    onInit() {
        this._registerMessages();
        this._registerForms();
    }
  
    _registerForms() {
        nl2arr(document.querySelectorAll(fieldQuery.form))
            .forEach((formElem)  => {
                this._forms.push(new Form(formElem));
            });  
    }

    _registerMessages() {
        nl2arr(document.querySelectorAll(fieldQuery.messages))
            .forEach((msgElem)  => {
                this._messages.push(new Message(msgElem));
            });  
    }

    destroy() {
        this._messages.length = 0;
        this._forms.length = 0;
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
        if(ruleTypes.hasOwnProperty(type))  {
            throw new Error(`${type} already exists as a rule type`);
        }
         if(typeof type !== 'string')  {
            throw new Error(`${type} must be a string.`);
        }
        ruleTypes[type] = exp;
        return this;

    }

    validator(key, fn, required, priority) {
        rules[key] = { 
            fn: fn,
            priority: priority || 0,
            handshake: true,
            required: required || false
        }
        return this;
    }

    init() {
        return this.onInit();
    }
}

module.exports = Gator;
 