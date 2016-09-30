import {FieldQuery, Type} from "./config";
import {nl2arr} from "./utils";
import mediator from "./mediator";
import factory from "./factory";
import validator from "./validator";

class Main { 
 
    constructor() {   }

    _init(formName) {

        mediator.registerValidator(validator);

        // Register Form
        let query = formName ? FieldQuery.form.replace(/\{\{name\}\}/, formName) : 'form';
        nl2arr(document.querySelectorAll(query))
            .forEach((formElem)  => {
                mediator.register(factory.create(Type.FORM, formElem));
                // Register Fields
                 nl2arr(formElem.querySelectorAll(
                    FieldQuery.input+ 
                    FieldQuery.select+
                    FieldQuery.textarea))
                        .forEach((fieldElem)  => {
                            mediator.register(factory.create(Type.FIELD, fieldElem, formElem));
                        });   
            });  
        
        // Register Messages
        nl2arr(document.querySelectorAll(FieldQuery.messages))
            .forEach((msgElem)  => {
                mediator.register(factory.create(Type.MESSAGE, msgElem));
            });  





         
    }

    registerForm(elem) {
         let obj = factory(elem, Type.FORM);
         mediator.register(obj);
    } 

    registerField(elem) {
         let obj = factory(elem, Type.Field);
         mediator.register(obj);
    } 

     
    
    
}

class Gator extends Main {

    constructor() {
        super();
    }

    init(formName) {
        this._init(formName);
    }



   
}

module.exports = Gator;
 