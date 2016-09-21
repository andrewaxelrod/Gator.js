import {nl2arr, pubSub} from "./utils.js";
import {attributes, fieldQuery} from "./config.js";

class Messages {

    constructor(msgsElem) {
        this._msgsElem = msgsElem;
        this._messages = {};
        this.formName = null;
        this.fieldName = null;
        this.onInit();
    }

    onInit() {
        let attrs = this._msgsElem.getAttribute(attributes.messages).split('.');
        this.formName = attrs[0];
        this.fieldName = attrs[1];
       
        this.register();
        this.hideAll();
        this.subscribe();
    }

    subscribe() {
        let self = this;
        this.subShow = pubSub.subscribe('messages:show', (obj) => {
            if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                self.hideAll();
                self.show(obj.key);
            }
        });

        this.subClear = pubSub.subscribe('messages:clear', (obj) => {
            if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                self.hideAll();
            }
        });

        this.subDestroy = pubSub.subscribe('messages:destroy', (obj) => {
            self.destroy();
        });
    }

    // register internal messages.
    register() {
        let self = this;
        nl2arr(this._msgsElem.querySelectorAll(fieldQuery.message))
                .forEach((msgElem)  => {
                    let key = msgElem.getAttribute(attributes.message);
                    if (key) {
                        self._messages[key] = msgElem; 
                    }  
                }); 
    }

    show(key) { 
        this.validateKey(key);
        this._messages[key].style.display = 'block';
    }

    hideAll() {
        let messages = this._messages;
        for(let key in messages ) {
            this.validateKey(key);
            messages[key].style.display = 'none';
        }
    }

    validateKey(key) {
         if (!this._messages.hasOwnProperty(key)) {
             throw new Error(`Missing "gt-${key} in gt-messages="${this.formName}.${this.fieldName}"`);
         }
    }

    destroy() {
        this._elem = null;
        this._messages.length = 0;
        this.subShow.remove();
        this.subClear.remove();
        this.subDestroy.remove();
    }
}

module.exports = Messages;

 