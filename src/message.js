import {Type, FieldQuery} from './config';
import * as util from './utils';

class Message {

    constructor(key, elem) {
       this.key = key;
       this.type = Type.MESSAGE;
       this.elem = elem || null;
       this.messages = {};
       this.mediator = null;
    }

    init() {
      this.registerBlockMessages();
      this.clear();
    }

    showMessage(key) {
        console.log(this.elem);
        this.clear();
        this.messages[key].style.display = 'block';
    }

    clear() {
        for(let key in this.messages ) {
            if (this.messages.hasOwnProperty(key)) {
                this.messages[key].style.display = 'none';
            }
        }
    }

     registerBlockMessages() {
        let self = this,
            key = null;
        util.nl2arr(this.elem.querySelectorAll(FieldQuery.message))
                .forEach((elem)  => {
                    key = util.getAttribute(elem, 'message');
                    if (key) {
                        self.messages[key] = elem; 
                    }  
                }); 
    }

    destroy() {
        this.elem = null;
        this.messages = null;
        this.mediator = null;
    }
}

module.exports = Message;

 