import {Type} from "./config";
import * as util from './utils';
import Form from './form';
import Field from './field';
import Message from './message';

const MESSAGES_ATTR = 'messages';

// A Simple Abstract Factory
class Factory {

    constructor() {}

    create(type, elem, parent) {
        let key = null;
        switch(type) {
            case Type.FORM:
                key = `${util.getName(elem)}`;
                return new Form(key, elem);
            case Type.FIELD:
                key = `${util.getName(parent)}:${util.getName(elem)}`;
                return new Field(key, elem);
            case Type.MESSAGE:
                key = util.getAttribute(elem, MESSAGES_ATTR);
                return new Message(key, elem);
        }
    }

}

module.exports = new Factory();