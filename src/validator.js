import {State, Event, Rules} from "./config";
import * as util from "./utils";

/** Class that validates all fields. */
class Validator { 
 
    /**
    * Create a validator 
    */
    constructor() { 
      this.fields = {};
      this.mediator = null;
    } 

    // TO-DO: Need to add to unit test
    validate(event, validators, fieldKey, fieldValue, fieldState) {
      console.log(event + ' ' +  validators + ' ' +  fieldKey + ' ' +   fieldValue + ' ' +   fieldState);
      if(!(validators instanceof Array) || typeof fieldKey !== 'string' || typeof fieldValue !== ('string' || 'number')) {
        throw new Error(`Validator.validatorLoop must have valid paramaters.`)
      }

      let validated = null,
          callbackObj = null,
          fields = null;

      // If field keys exist in the field cache, update their values.
      for(let validatorKey in this.fields) {
        if(this.fields[validatorKey].hasOwnProperty(fieldKey)) {
          this.fields[validatorKey][fieldKey] = fieldValue;
        }
      }

      validated = this.validateLoop(event, validators, fieldValue, fieldState);

      fields = this.fields.hasOwnProperty(validated.validatorKey) ? this.fields[validated.validatorKey] : null;

      // ASYNC Field Validation
      if(validated.async) {
        callbackObj = {mediator: this.mediator, fields: fields, validatorKey: validated.validatorKey};

        Rules[validated.validatorKey].fn(fields,
          this.asyncCallback.bind(util.extend(callbackObj, {state: State.SUCCESS})),  
          this.asyncCallback.bind(util.extend(callbackObj, {state: State.ERROR})));     

        this.mediator.validateResponse(validated.state, fieldKey, validated.validatorKey);
      // Group Field Validation
      } else if (validated.group) {
        for(let fieldKey in fields) {
          if (fields.hasOwnProperty(fieldKey)) { 
            this.mediator.validateResponse(validated.state, fieldKey, validated.validatorKey);
          }
        }
      // Single Field Validation
      }  else {
        this.mediator.validateResponse(validated.state, fieldKey, validated.validatorKey);
      }
    }

    /**
     * Loops through all the validators for a given field and returns an object based on the validation of the field value.  
     * @param {{key: string, params: string[], event: string, groupReady: boolean, group: boolean, async: boolean, priority: numbr]}[]} validators
     * @param {String} fieldKey
     * @param {String|Number} fieldValue
     * @returns {{async: boolean, group: boolean, state: STATE, fieldValue: string|number}} - Returns a validation object for this.valdiate to process.
     */
    validateLoop(event, validators, fieldValue, fieldState) {
 
      // TO-DO Could be removed...
      if(typeof event !== 'string' || !(validators instanceof Array) || typeof fieldValue !== ('string' || 'number')) {
        throw new Error(`Validator.validatorLoop must have valid paramaters.`)
      }  
 
      let result = {
        state: State.VALIDATING,
        fieldValue: fieldValue
      };
  
      for(let validator of validators) {

        if(!validator.key || !Rules.hasOwnProperty(validator.key)) {
          throw new Error(`Validator.validatorLoop: ${validator.key} must be a valid validator.`)
        }

        result.validatorKey = validator.key;
        result.async = false;
        result.group = false;

        if( (validator.event === Event.CHANGE && fieldState === State.ERROR) || event !== validator.event )  {
           result.state = State.SKIP;
        } else if(validator.async) { 
            result.async = true;
            result.state = State.ASYNC;
            break;
        } else if(validator.group) { 
          if(!Rules[validator.key].group) {
            throw new Error(`Validator.validatorLoop: ${validator.key} must be a group validator.`)
          }

          result.group = true;

          if (!Rules[validator.key].fn.call(validator, this.fields[validator.key])) {
            result.state = State.ERROR;
            break;
          } else {
            result.state = State.SUCCESS;
          }
        } else { 
           if(!Rules[validator.key].fn.call(validator, fieldValue)) {
            result.state = State.ERROR;
            break;
          } else {
            result.state = State.SUCCESS;
          }
        }
      }
 
      return result;
    }

    /**
     * Checks the this.fields cache object if all fields have a value for a given validator.  
     * @param {String} validatorKey
     * @returns {Boolean} - Returns true if all fields in this.fields isn't set to null.
     */
    isFieldGroupReady(validatorKey) {
      if(!validatorKey || !this.fields.hasOwnProperty(validatorKey)) {
        throw new Error(`Validator.isFieldGroupReady: ${validatorKey} not found in validator.fields.`)
      }
      let fields = this.fields[validatorKey];
      for(let fieldKey in fields)  {
        if (fields.hasOwnProperty(fieldKey)) {
          if(fields[fieldKey] === null) {
            return false;
          }
        }
      }
      return true;
    } 

    asyncCallback() {
      for(let fieldKey in this.fields) {
        if(this.fields.hasOwnProperty(fieldKey)) {
          this.mediator.validateResponse(this.state, fieldKey, this.validatorKey);
        }
      }
    }

    /**
     * Extends and prioritizes the validators property. Adds a group or async validator with it's field to the this.field cache object.
     * @param {{key: string, params: null|string[], event: string, groupReady: boolean]}[]} validators
     * @param {String} fieldKey
     */
    initValidators(validators, fieldKey) {
        if(!fieldKey || typeof fieldKey !== 'string'  || !(validators instanceof Array)) {
          throw new Error(`Validator.initValidators: Invalid paramaters.`)
        }

        for(let validator of validators) {
          if(!Rules.hasOwnProperty(validator.key)) {
            throw new Error(`Validator.initValidators: ${validator.key} is an Invalid validator`);
          }

          util.extend(validator, {
            priority: Rules[validator.key].priority || 0,
            group: Rules[validator.key].group || false,
            async: Rules[validator.key].async || false
          });

          // If validator is a group or async validator, add it with the field to the this.field cache object.
          if(validator.group || validator.async) {
            if(!this.fields.hasOwnProperty(validator.key)) {
              this.fields[validator.key] = {};
            }
            this.fields[validator.key][fieldKey] = null;
          }
        }

        // Sort the validators based on priority.
        validators.sort((a, b) =>  b.priority - a.priority);
    }
 
}

/** @module Validator Singleton */
module.exports = new Validator();
