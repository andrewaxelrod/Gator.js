import { pubSub } from "./utils";
import FormField from './form-field';
import {objType} from "./config.js";


// This is an Event Loop
class Coordinator {

    constructor() {
        this.onInit();
    }

    onInit() {
        this.subscribe();
    }

    subscribe() {
        let self = this;
        this.subCoordinate = pubSub.subscribe('coordinate', (obj) => {
            if (obj.objType === objType.FIELD) {
                pubSub.publish('field:validate', obj.uniqueId); 
            }
        }); 
    }

    whichObject(obj) {
        if(obj instanceof FormField) {
            return 'FORM_FIELD';
        }
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