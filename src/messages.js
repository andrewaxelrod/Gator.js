import {nl2arr, pubSub} from "./utils.js";
import {attributes, fieldQuery} from "./config.js";

class Message {

    constructor(msgsElem) {
        this._elem = msgsElem;
        this._messages = {};
        this.formName = null;
        this.fieldName = null;
        this.onInit();
    }

    onInit() {
        let attrs = this._elem.getAttribute(attributes.messages).split('.');
        this.formName = attrs[0];
        this.fieldName = attrs[1];
        this.registerBlockMessages();
        this.subscribe();
        this.clearMessages();
    }

    subscribe() {
        this.subShow = pubSub.subscribe('messages:show', this.showMessage.bind(this));
        this.subClear = pubSub.subscribe('messages:clear', this.clearMessages.bind(this));
        this.subDestroy = pubSub.subscribe('messages:destroy', this.destroy.bind(this));
    }

    clearMessages(obj) {
        let messages = this._messages;
        if (obj === undefined || (obj.fieldName === this.fieldName && obj.formName === this.formName)) {
            for(let key in messages ) {
                if (this._messages.hasOwnProperty(key)) {
                    messages[key].style.display = 'none';
                }
            }
        }
    }

    showMessage(obj) {
        if (obj.fieldName === this.fieldName && obj.formName === this.formName) {
                this.clearMessages(obj);
                if (this._messages.hasOwnProperty(obj.key)) {
                    this._messages[obj.key].style.display = 'block';
                }
        } 
    }

    isKeyValid(key) {
         if (!this._messages.hasOwnProperty(key)) {
             throw new Error(`Missing "gt-${key} in gt-messages="${this.formName}.${this.fieldName}"`);
         }
    }

    registerBlockMessages() {
        let self = this,
            key = null;
        nl2arr(this._elem.querySelectorAll(fieldQuery.message))
                .forEach((msgElem)  => {
                    key = msgElem.getAttribute(attributes.message);
                    if (key) {
                        self._messages[key] = msgElem; 
                    }  
                }); 
    }

    destroy() {
        console.log('messages are destroyed');
        this._elem = null;
        this._messages = null;
        this.subShow.remove();
        this.subClear.remove();
        this.subDestroy.remove();
    }
}

module.exports = Message;

 