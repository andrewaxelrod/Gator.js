import FormField from './form-field';
import Messages from './messages';
import * as util from "./utils.js";
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
        util.nl2arr(this.elem.querySelectorAll(
            fieldQuery.input+ 
            fieldQuery.select+
            fieldQuery.textarea))
                .forEach((elem)  => {
                    this.fields.push(new FormField(this, elem));
                });  
    }

    registerMessages() {
        let self = this;
                util.nl2arr(this.elem.querySelectorAll(
                    `[${fieldQuery.messages}]`))
                        .forEach((elem)  => {
                            this.messages.push(new Messages(this, elem));
                        });  
    }

    destroy() {
        this.elem = null;
        this.fields = [];
    }

}

module.exports = Form;
