# gator.js

> Angular Style Form Validator built with Vanilla Javascript. No Angular. No Jquery. 

## Status

Gator.js is still in development. The first official release will be ready in October of 2016.

## Demo

https://andrewaxelrod.github.io/Gator.js/demo.html

## Setup

```html
<script src="dist/gator.min.js"></script>
```

Now, you need to instantiate it.   

```js
new Gator(); // All Forms
```

```js
new Gator('formName'); // Target a single form
```

# Usage

### Basic Usage

The error messages block doesn't have to be bound within the form. It could be placed anywhere within the html page. Each validator is assigned a priority and will be executed in a linear order. 

```html
 <form name="simpleRegistration"  action='....' method="POST">
    <label for="email">Email</label>
    <input type="text" name="email" 
           gt-minlength="5"
           gt-maxlength="15"
           gt-type='email'
           required>
    <div gt-messages="simpleRegistration.email" role="alert">
        <div gt-message="required">Email is required.</div>
        <div gt-message="minlength">Email is too short.</div>
        <div gt-message="maxlength">Email is too long.</div>
        <div gt-message="type">Email must be valid.</div>
    </div>
</form>
```

### Listeners 

The default listerner for all fields is keyup. You have the ability to change the listener for individual validators. In this example min-length, max-length, and required are set to keyup, while type is set to the change event.

```html
    <input type="text" name="email" 
           gt-minlength="5"
           gt-maxlength="15"
           gt-type='email:change'
           required>
```

### Grouping of fields

| Grouping         | Description                                   |
|------------------|-----------------------------------------------| 
| gt-same          | The field values must be equal.               |        
| gt-one           | One of many fields must have a value.         |                    
| gt-multiple      | A custom number of fields must have a value.  |                         

In this example, we add the validator, gt-same, to two fields. This validator will be executed comparing multiple fields. 

```html
<form name="simpleRegistration"  action='....' method="POST">
    <label for="password">Password</label>
    <input type="text" name="password" 
           gt-same
           required>
    <div gt-messages="simpleRegistration.password" role="alert">
        <div gt-message="required">Password is required.</div>
    </div>

    <label for="password">Confirm Password</label>
    <input type="text" name="confirm_password" 
           gt-same
           required>
    <div gt-messages="simpleRegistration.confirm_password" role="alert">
        <div gt-message="required">Password is required.</div>
        <div gt-message="same">Passwords must match.</div>
    </div>
</form>
```

### Custom Types 

In this example, we add the custom type, username.

```html
 <input type="text" name="confirm_password" 
    gt-type="username"
    required>
```

```js
 var gator = new Gator({listener: 'change'})
    .addRuleType('username', /^[a-zA-Z0-9]+$/)
    .init('simpleRegistration');

```

### Custom Validators with Callbacks 





## Browser Support

| <img src="https://clipboardjs.com/assets/images/chrome.png" width="48px" height="48px" alt="Chrome logo"> | <img src="https://clipboardjs.com/assets/images/firefox.png" width="48px" height="48px" alt="Firefox logo"> | <img src="https://clipboardjs.com/assets/images/ie.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="https://clipboardjs.com/assets/images/opera.png" width="48px" height="48px" alt="Opera logo"> | <img src="https://clipboardjs.com/assets/images/safari.png" width="48px" height="48px" alt="Safari logo"> |
|:---:|:---:|:---:|:---:|:---:|
| 42+ ✔ | 41+ ✔ | 9+ ✔ | 29+ ✔ | 10+ ✔ |