import {pubSub} from "./utils";
import FormField from './form-field';
import {objType, fieldState} from "./config.js";


// This is an Event Loop
class Coordinator {

    constructor() {
        this.onInit();
        this.handShakes = {};
    }

    onInit() {
        this.subscribe();
    }

    subscribe() {
        let self = this;
        this.subCoordinate = pubSub.subscribe('coordinate', (obj) => {
            if(obj.objType === objType.FIELD) {
                this.funnelField(obj);
            }
        }); 
    }

    funnelField(field) {


           // Check the state of the field
            if (field.state === fieldState.SUCCESS || field.state === fieldState.ERROR) {
                console.log(field.fieldName + ' is already validated.');
                return;
            } else if (field.state === fieldState.HANDSHAKE) {
                 console.log(field.fieldName + ' is in handshake mode.');
              //  this.addHandShake(field);
            } else {
                console.log(field.fieldName + ' is in going to be validated.');
                pubSub.publish('field:validate', field.uniqueId);
            } 



/*

            if (ob.state === fieldState.HANDSHAKE) {
                if(!this.handShakes.hasOwnProperty(obj.validation)) {
                    this.handShakes[obj.validation] = {};
                }
                this.handShakes[obj.validation][obj.fieldName] = obj.fieldValue;
            }

            if (obj.objType === objType.FIELD) {
                pubSub.publish('field:validate', obj.uniqueId); 
            }

            this.handShakes = null;

            */
    }

    validateFields() {
         // Could send an obj, but the you are ending the same object back to the object. 
         // This may cause a ciruclar reference. 
         //
         // You could also do an obj.validate(), which would break the pub/sub.
         pubSub.publish('field:validate', uniqueId);
    }

    destroy() {
        this.subCoordinate.remove();
    }
}

module.exports = new Coordinator;