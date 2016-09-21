import {pubSub} from "./utils";
import FormField from './form-field';
import {objType, fieldState} from "./config.js";


let validateEmailAndPassword =  {
        fn: (fields, callback) => { console.log(fields); callback() },
        fields: ['a', 'b']
};
let validateEmailAndPassword2 =  {
        fn: (fields, callback) => { console.log(fields); callback() },
        fields: ['aa', 'bb']
};

// This is an Event Loop
class Handshake {

    constructor() {
        this.onInit();

        let callback = this.callback;
        let fields = 'safdsaf';

        this._handshakes = {
            validateEmailAndPassword: {
                fn: (fields, callback) => { console.log(fields); callback(); },
                fields: 'abcd'
            }     
        };
    }
 
    onInit() {
        this.subscribe();
    }


    callback() {
         console.log(this);
    }

    subscribe() {
        let self = this;
        this.subCoordinate = pubSub.subscribe('handshake:add', (obj) => {
            
        }); 
        this.subCoordinate = pubSub.subscribe('handshake:run', (obj) => {
           
           let handshakeName = obj.fieldValidator.params[0],
                fieldName = obj.fieldName,
                fieldValue = obj.fieldValue;

      //   console.log(handshakeName+ ' ' +fieldName+' '+fieldValue);

       //  self._handshakes[handshakeName].fn();

        validateEmailAndPassword.fn(validateEmailAndPassword.fields, self.callback.bind(validateEmailAndPassword));
    
        }); 
    }

    addHandshake(event, field) {
         if(obj.handshake)  {
             this._handshakes[event].fields.push(field)
         }
    }

    clearHandshakes() {

    }

    runHandshakes() {

    }

    destroy() {
        this.subCoordinate.remove();
    }

    resolve() {

    }
}

module.exports = new Handshake;

/*
validateEmail = {
    fn: () => {
        
         return (self.fields, self.resolve, self.reject) => {


         }
    },
    fields: {
        email: 'andrew@gmail.com',
        password: 'helloworld123'
    }
}
 
*/

