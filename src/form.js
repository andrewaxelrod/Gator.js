import {Type} from "./config";

class Form { 
 
    constructor(key, elem, name) { 
        this.type = Type.FORM;
        this.key = key || null;
        this.elem = elem || null;
        this.name = elem.name || null;
        this.mediator = null;
    }
 
    onInit() {
     
    }
   
    destroy() {

    }
}

module.exports = Form;
