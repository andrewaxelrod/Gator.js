import FormField from './form-field';
import Messages from './messages';
import {nl2arr} from "./utils.js";
import {fieldQuery} from "./config.js";

class Form { 
 
    constructor(elem) { 
        this.elem = elem;
        this.fields = [];
        this.messages = [];
        this.name = this.elem.getAttribute("name");
        this.onInit();
    }
 
    onInit() {
        this.registerFormFields();
        this.registerMessages(); 
    }

    registerFormFields() {
        let self = this;
        nl2arr(this.elem.querySelectorAll(
            fieldQuery.input+ 
            fieldQuery.select+
            fieldQuery.textarea))
                .forEach((elem)  => {
                    this.fields.push(new FormField(elem, this.name));
                });  
    }

    registerMessages() {
        let self = this;
        nl2arr(this.elem.querySelectorAll(fieldQuery.messages))
            .forEach((elem)  => {
                this.messages.push(new Messages(elem));
            });  
    }

    destroy() {
        this.elem = null;
        this.fields.length = 0;
    }

}

module.exports = Form;
