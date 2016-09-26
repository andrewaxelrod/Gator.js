import FormField from './form-field';
import Messages from './messages';
import {nl2arr, pubSub} from "./utils.js";
import {FieldQuery} from "./config.js";

class Form { 
 
    constructor(formElem) { 
        this._elem = formElem;
        this._fields = [];
        this.name = null;
        this.onInit();
    }
 
    onInit() {
        this.name = this._elem.getAttribute("name");
        this.registerFormFields();
        this.subscribe();
    }

     subscribe() {
        this.subCBDestroy = pubSub.subscribe('form:destroy', this.destroy.bind(this));        
    }

    registerFormFields() {
        nl2arr(this._elem.querySelectorAll(
            FieldQuery.input+ 
            FieldQuery.select+
            FieldQuery.textarea))
                .forEach((fieldElem)  => {
                    this._fields.push(new FormField(fieldElem, this.name));
                });  
    }

    destroy() {
        console.log('form is destroyed');
        this._elem = null;
        this._fields.length = 0;
        this.subCBDestroy.remove();
    }
}

module.exports = Form;
