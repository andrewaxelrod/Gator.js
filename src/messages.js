import {nl2arr, pubSub} from "./utils.js";
import {fieldQuery} from "./config.js";

class Messages {

    constructor(parent, elem) {
        this.parent = parent;
        this.elem = elem;
        this.messages = {};
        this.formName = null;
        this.fieldName = null;
        this.onInit();
    }

    onInit() {
        let attrs = this.elem.getAttribute(fieldQuery.messages).split('.');
        this.formName = attrs[0];
        this.fieldName = attrs[1];
       
        this.registerMsgs();
        this.hideAllMessages();
        this.subscribe();
    }

    subscribe() {
        let self = this;
        this.subShow = pubSub.subscribe('messages:show', (obj) => {
            if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                self.hideAllMessages();
                self.show(obj.key);
            }
        });

        this.subClear = pubSub.subscribe('messages:clear', (obj) => {
            if (obj.fieldName === self.fieldName && obj.formName === self.formName) {
                self.hideAllMessages();
            }
        });
    }

    registerMsgs() {
        let self = this;
        nl2arr(this.elem.querySelectorAll(
            `[${fieldQuery.message}]`))
                .forEach((elem)  => {
                    let key = elem.getAttribute(fieldQuery.message);
                    if (key) {
                        self.messages[key] = elem;
                    }
                }); 
    }

    show(key) { 
        this.messages[key].style.display = 'block';
    }

    hideAllMessages() {
        let messages = this.messages;
        for(let key in messages ) {
            if (messages.hasOwnProperty(key)) {
                messages[key].style.display = 'none';
            }
        }
    }

    destroy() {
        this.elem = null;
        this.messages = null;
        this.subShow.remove();
        this.subClear.remove();
    }
}

module.exports = Messages;

 