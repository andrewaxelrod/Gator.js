import {Type, State} from "./config";
import * as util from "./utils";

const BUTTONS_QUERY = `input[type=button],button[type=submit]`;
 
class Form { 

    constructor(key, elem, name) { 
        this.type = Type.FORM;
        this.state = State.INIT;
        this.key = key || null;
        this.elem = elem || null;
        this.name = elem.name || null;
        this.fieldsState = {};
        this.submitButton = null;
        this.mediator = null;
    }
 
    init() {
        this.registerButtons();
    }

    registerButtons() {
        let buttons = [];

        util.nl2arr(this.elem.querySelectorAll(BUTTONS_QUERY))
            .forEach((btnElem)  => {
                buttons.push(btnElem);
            });  

        if(buttons.length>1) {
            throw new Error('Only one submit button is allowed per form.');
        }

        this.submitButton = buttons[0];
    }

    onFieldStateChange(fieldKey, state) {
        this.fieldsState[fieldKey] = state;
        this.enableDisableSubmitButton();
    }

    enableDisableSubmitButton() {
        if(this.fieldsStateSuccessful()) {
            this.submitButton.disabled = false;
        } else {
            this.submitButton.disabled = true;
        }
    }

    fieldsStateSuccessful() {
        for(let field in this.fieldsState) {
            if(this.fieldsState.hasOwnProperty(field) && this.fieldsState[field] !== State.SUCCESS) {
                return false
            }
        }
        return true;
    }

    validate() {
        this.mediator.validateAll();
    }

    submit() {

    }
   
    destroy() {
        this.elem = null;
        this.errors = null;
        this.submitButton = null;
        this.mediator = null;
    }
}

module.exports = Form;
