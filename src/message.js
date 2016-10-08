import {NAMESPACE, Type} from './config';
import * as util from './utils';

const MESSAGE_QUERY = `[${NAMESPACE}-message]`,
      ATTR_MESSAGE = 'message',
      StyleDisplay = {
          BLOCK: 'block',
          NONE: 'none'
      };

class Message {

    constructor(key, elem) {
        this.type = Type.MESSAGE;
        this.key = key;
        this.elem = elem || null;
        this.messages = {};
        this.mediator = null;
    }

    init() {
      this.registerBlockMessages();
      this.clear();
    }

    showMessage(key) {
        this.clear();
        if(this.messages.hasOwnProperty(key)) {
            this.messages[key].style.display = StyleDisplay.BLOCK;
        }
    }

    clear() {
        for(let key in this.messages ) {
            if (this.messages.hasOwnProperty(key)) {
                this.messages[key].style.display = StyleDisplay.NONE;
            }
        }
    }

     registerBlockMessages() {
        let self = this,
            key = null;

        util.nl2arr(self.elem.querySelectorAll(MESSAGE_QUERY))
                .forEach((elem)  => {
                    key = util.getAttribute(elem, ATTR_MESSAGE);

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

 