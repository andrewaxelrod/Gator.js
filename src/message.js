import {Type} from './config';

class Message {

    constructor(key, elem) {
       this.key = key;
       this.type = Type.MESSAGE;
       this.elem = elem || null;
       this.mediator = null;
    }

    onInit() {
      
    }

    destroy() {
      
    }
}

module.exports = Message;

 