import {STATE, RULES, RULE_TYPES} from "./config";
import * as util from "./utils";

class Validator { 
 
    constructor() { 
      this.groups = {};
      this.groupReadyFlag = true;
      this.mediator = null;
    } 

    validate(validators, fieldKey, fieldValue) {

      let result = this.validateLoop(validators, fieldKey, fieldValue),
          group = null;

      if(result.group) {
        group = this.groups[result.group];
        for(let groupFieldKey in group) {
          if (group.hasOwnProperty(groupFieldKey)) {
            this.mediator.validateResponse(result.state, groupFieldKey, result.validatorKey);
          }
        }
      } else {
         this.mediator.validateResponse(result.state, fieldKey, result.validatorKey);
      }
    }

    validateLoop(validators, fieldKey, fieldValue) {

      let result = {};

      for(let validator of validators) {

        result.state = STATE.WAIT;
        result.validatorKey = validator.key;
        result.group = null;

        // Reset the value of this field in the groups Cache.
        if(this.groups.hasOwnProperty(validator.key)) {
           this.groups[validator.key][fieldKey] = null;
        }

        // Validate ASYNC Condition  
        if(validator.async) {

        // Validate Group Condition   
        } else if(validator.group) {
          // Regardless of the validation result, set the value of the group field.
          this.groups[validator.key][fieldKey] = fieldValue;

          // If all fields should be set before validating group fields.
          if(this.groupReadyFlag && !this.checkGroupReady(validator.key)) {
            result.state = STATE.SKIP;
            break;
          }

          result.group = validator.key;
          if (!RULES[validator.key].fn.call(validator, this.groups[validator.key])) {
            result.state = STATE.ERROR;
            break;
          } else {
            result.state = STATE.SUCCESS;
          }

        // Validate Single Condition    
        } else {
          if(!RULES[validator.key].fn.call(validator, fieldValue)) {
            result.state = STATE.ERROR;
            break;
          } else {
            result.state = STATE.SUCCESS;
          }
        }
      }

      return result;
    }

    checkGroupReady(key) {
      let group = this.groups[key];
      for(let groupFieldKey in group)  {
        if (group.hasOwnProperty(groupFieldKey)) {
          if(group[groupFieldKey] === null) {
            return false;
          }
        }
      }
      return true;
    } 

    initValidators(validators, fieldKey) {
        for(let validator of validators) {
          if(!RULES.hasOwnProperty(validator.key)) {
            util.log.error(`${validator.key} is an Invalid validator`);
          }
          // Set Priority
          validator.priority = RULES[validator.key].priority || 0; 
          validator.group = RULES[validator.key].group || false; 
          validator.async = RULES[validator.key].async || false; 
          if(validator.group) {
            if(!this.groups.hasOwnProperty(validator.key)) {
              this.groups[validator.key] = {};
            }
            this.groups[validator.key][fieldKey] = null;
          }
        }
        validators.sort((a, b) =>  b.priority - a.priority);
    }
 
}

module.exports = new Validator();
