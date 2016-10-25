import {NAMESPACE_PREFIX, RuleTypes, Rules, Type} from "./config";
import * as util from "./utils";
import mediator from "./mediator";
import factory from "./factory";
import validator from "./validator"; 

window.m = mediator;

const FORMS_QUERY = `form`,
      FIELDS_QUERY = `input:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])` +
                     `,select[required]:not(:disabled):not([readonly])` + 
                     `,textarea[required]:not(:disabled):not([readonly])`,
      MESSAGES_QUERY = `[${NAMESPACE_PREFIX}messages]`;

class Main { 
 
    constructor() {   }

    _init(query) {
        this.registerValidator();
        this.registerForms(query); 
        this.registerMessages();
        mediator.init();
    }

    registerValidator() {
        mediator.registerValidator(validator);
    } 
            
    registerForms(query) {
        let formObj = null,
            fieldObj = null;

        // Register Forms
        util.nl2arr(document.querySelectorAll(query || FORMS_QUERY))
            .forEach((formElem)  => {
                formObj = factory.create(Type.FORM, formElem);
                mediator.register(formObj);

                // Register Fields within a form
                 util.nl2arr(formElem.querySelectorAll(FIELDS_QUERY))
                        .forEach((fieldElem)  => {
                            fieldObj = factory.create(Type.FIELD, fieldElem, formElem);
                            mediator.register(fieldObj);
                        });   
            });  
    } 

    registerMessages(elem) {
        let message = null;
        
        util.nl2arr(document.querySelectorAll(MESSAGES_QUERY))
            .forEach((msgElem)  => {
                message = factory.create(Type.MESSAGE, msgElem);
                mediator.register(message);
            });  
    }  
}

/* --------------------- API --------------------------*/ 
/* This is in the works and still in beginning stages. */

class Gator extends Main {

    constructor() {
        super();
    }

    init(query) {
        this._init(query);
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

    validator(key, fn, async, group, priority) {
          window.rules = Rules;
        // TO-DO: Check for correct parameters
        Rules[key] = { 
            fn: fn,
            priority: priority || 0,
            async: async || false,
            group: group || false
        }
        return this;
    }

  
   
}

module.exports = Gator;
 