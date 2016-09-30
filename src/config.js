
export const PREFIX = 'gt';

export const PRIORITY_DEFAULT = 30;

export const Type = {
    FORM: 0,
    FIELD: 1,
    MESSAGE: 2,
    VALIDATOR: 4,
};

export const ValidatorState = {
    INIT: 0,
    WAIT: 1,
    SUCCESS: 2,
    ERROR: 4,
    HANDLER: 5
};

export const Events = {
    KEYUP: 'keyup',
    CHANGE: 'change' 
};

export const  FieldQuery = {
      prefix: `^${PREFIX}`,
      input: 'input:not(:disabled):not([readonly]):not([type=hidden]):not([type=reset]):not([type=submit]):not([type=button])',
      select: ',select[required]:not(:disabled):not([readonly])',
      textarea: ',textarea[required]:not(:disabled):not([readonly])',
      form: `form[name="{{name}}"]`,
      messages: `[${PREFIX}-messages]`,
      message: `[${PREFIX}-message]`
};

export const Attributes = {
    prefix: `${PREFIX}-`,
    messages: `${PREFIX}-messages`,
    message: `${PREFIX}-message`
};