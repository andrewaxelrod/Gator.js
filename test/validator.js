'use strict';
import {STATE, RULES, RULE_TYPES} from "../src/config";
import validator from '../src/validator';

describe('Validator', () => {

    describe('isFieldGroupReady(validatorKey)', () => {
      
        after(() => {
              validator.fields = {};
        });

        it('should throw an error if validator key was not found in validator.fields', () => {
            validator.fields = { 
                different: {
                    someKey: 'abc'
                }};
            assert.throws(() => {validator.isFieldGroupReady('same')}, Error); 
        });  

        it('should pass if all fields have a value', () => {
            validator.fields = { 
                same: {
                    someKey: 'abc',
                    anotherKey: '123'
                }};
            assert.isTrue(validator.isFieldGroupReady('same'));
        });  

        it('should fail if a field is null', () => {
            validator.fields = { 
                same: {
                    someKey: null,
                    anotherKey: '123'
                }};
            assert.isFalse(validator.isFieldGroupReady('same'));
        });  
    }); 
        
    describe('validatorLoop', () => { 

        after(() => {
              validator.fields = {};
        });

        it('should thow errors for invalid paramaters', () => {
            assert.throws(validator.validateLoop, Error); 
            assert.throws(() => {validator.validateLoop(null)}, Error); 
            assert.throws(() => {validator.validateLoop({}, 'key')}, Error); 
            assert.throws(() => {validator.validateLoop({}, 'key', ['test'])}, Error); 
            assert.throws(() => {validator.validateLoop({}, 5, 'value')}, Error); 
        });  

        it('should thow errors for invalid paramaters', () => {
            assert.throws(() => {validator.validateLoop({}, 'validKey', 'validValue')}, Error); 
            assert.throws(() => {validator.validateLoop({stuff: 'stuff'}, 'validKey', 'validValue')}, Error); 
        });  

        it('should pass with a single validator', () => {
            let fieldValue = '',
                validators = [{
                    async: false,
                    group: false,
                    event: 'keyup',
                    key: 'required',
                    params: null,
                    priority: 1024
                }],
                expected = {
                    async: false,
                    group: false,
                    state: null,
                    validatorKey: null,
                    fieldValue: fieldValue
                },
                actual = null;

            expected.validatorKey = 'required';
            expected.state = 'ERROR';
            fieldValue = expected.fieldValue = '';      
            actual = validator.validateLoop(validators, fieldValue); 
            assert.deepEqual(actual, expected, ['Error State']);

            expected.validatorKey = 'required';
            expected.state = 'SUCCESS';
            fieldValue = expected.fieldValue = 'abc';   
            actual = validator.validateLoop(validators, fieldValue);
            assert.deepEqual(actual, expected, ['Success State']);
        }); 

        it('should pass with multiple validators', () => {
            let fieldValue = '',
                validators = [{
                    async: false,
                    group: false,
                    event: 'keyup',
                    key: 'required',
                    params: null
                }, {
                    async: false,
                    group: false,
                    event: 'keyup',
                    key: 'minlength',
                    params: ['5'] 
                }, {
                    async: false,
                    group: false,
                    event: 'keyup',
                    key: 'maxlength',
                    params: ['15']
                }],
                expected = {
                    async: false,
                    group: false,
                    state: null,
                    validatorKey: null,
                    fieldValue: fieldValue
                },
                actual = null;

            expected.validatorKey = 'required';
            expected.state = 'ERROR';
            fieldValue = expected.fieldValue = '';   
            actual = validator.validateLoop(validators, fieldValue); 
            assert.deepEqual(actual, expected, ['First Pass of validaton']);

            expected.validatorKey = 'minlength';
            expected.state = 'ERROR';
            fieldValue = expected.fieldValue = 'abc';
            actual = validator.validateLoop(validators, fieldValue);
            assert.deepEqual(actual, expected, ['Second Pass of validaton']); 

            expected.validatorKey = 'maxlength';
            expected.state = 'ERROR';
            fieldValue = expected.fieldValue = '123456789012345678';
            actual = validator.validateLoop(validators, fieldValue);
            assert.deepEqual(actual, expected, ['Third Pass of validaton']); 

            expected.validatorKey = 'maxlength';
            fieldValue = expected.fieldValue = '12345678';
            expected.state = 'SUCCESS';
            actual = validator.validateLoop(validators, fieldValue);
            assert.deepEqual(actual, expected, ['Success state']); 

        });

        it('should validate correctly with a group validator', () => {
            validator.fields = { 
                same: {
                    someKey: null,
                    anotherKey: null
                }}; 
            let fieldValue = 'abc',
                validators = [{
                    async: false,
                    group: true,
                    event: 'keyup',
                    key: 'same',
                    params: null
                }],
                expected = {
                    async: false,
                    group: true,
                    state: null,
                    validatorKey: 'same',
                    fieldValue: fieldValue
                },
                actual = null; 

            expected.state = 'ERROR';
            fieldValue = expected.fieldValue = 'abc';   
            validator.fields.same = {
                someKey: 'abc',
                anotherKey: '123'
            };
            actual = validator.validateLoop(validators, fieldValue); 
            assert.deepEqual(actual, expected, [`Fields don't match`]);

            expected.state = 'SUCCESS';
            fieldValue = expected.fieldValue = 'abc';   
            validator.fields.same = { 
                someKey: 'abc',
                anotherKey: 'abc'
            };
            actual = validator.validateLoop(validators, fieldValue); 
            assert.deepEqual(actual, expected, [`Fields match`]);
 
            validators[0].key = 'required';
            assert.throws(() => {validator.validateLoop(validators, fieldValue)}, Error, ['validatorKey should be a group validator']); 
         
        });

        it('should validate correctly for an async validator', () => {
            validator.fields = { 
                same: {
                    someKey: null
                }}; 
            let fieldValue = 'abc',
                validators = [{
                    async: true,
                    group: false,
                    event: 'keyup',
                    key: 'same',
                    params: null
                }],
                expected = {
                    async: true,
                    group: false,
                    state: 'ASYNC',
                    validatorKey: 'same',
                    fieldValue: fieldValue
                },
                actual = null; 

            actual = validator.validateLoop(validators, fieldValue); 
            assert.deepEqual(actual, expected);
         
        });

        it('should validate correctly for an async or group validator if fields are not ready when groupReady is true.', () => {
            validator.fields = { 
                same: {
                    someKey: 'stuff',
                    anotherKey: null
                }}; 
            let fieldValue = 'abc',
                validators = [{
                    async: false,
                    group: true,
                    groupReady: true,
                    event: 'keyup',
                    key: 'same',
                    params: null
                }],
                expected = {
                    async: false,
                    group: true,
                    state: 'GROUP_NOT_READY',
                    validatorKey: 'same',
                    fieldValue: fieldValue
                },
                actual = null; 

            actual = validator.validateLoop(validators, fieldValue); 
            assert.deepEqual(actual, expected, ['Group']);

            validators[0].async = true;
            validators[0].group = false;
            assert.deepEqual(actual, expected, ['Async']);

        });
    });    

    describe('validator(validators, fieldKey, fieldValue)', () => {

        it('should give validatorLoop the correct arguments.', () => {
            let fieldValue = 'someValue',
                fieldKey = 'somekey',
                validators = [{
                    async: false,
                    group: false,
                    event: 'keyup',
                    key: 'required',
                    params: null,
                    priority: 1024 
                }],
                validatorLoopResult = {
                    async: false,
                    group: true,
                    state: 'GROUP_NOT_READY',
                    validatorKey: 'same',
                    fieldValue: fieldValue
                };


            let validateLoop = sinon.stub(validator, 'validateLoop');
            validateLoop.returns(validatorLoopResult);

            validator.validate(validators, fieldKey, fieldValue);
            sinon.assert.calledWith(validateLoop, validators, fieldValue);
        });  

         it('should give validatorLoop the correct arguments.', () => {
            

        });  
    }); 

});          