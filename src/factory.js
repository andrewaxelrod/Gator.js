import {Type} from "./config";
import {getUniqueId} from './utils';
import Form from './form';
import Field from './field';
import Message from './message';

// A Simple Abstract Factory
class Factory {

    constructor() {}

    create(type, elem, parent) {
        let key =  getUniqueId(),
            name = elem && elem.hasAttribute('name') ? elem.name : null,
            parentName = parent && parent.hasAttribute('name') ? parent.name : null;
        switch(type) {
            case Type.FORM:
                return new Form(key, elem, name);
            case Type.FIELD:
                return new Field(key, elem, name, parentName);
            case Type.MESSAGE:
                return new Message(key, elem);
        }
    }

}

module.exports = new Factory();
