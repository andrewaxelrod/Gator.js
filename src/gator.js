import Form from './form';
 
class Gator { 
 
    constructor() { 
        var elem = document.getElementById('customerForm');
        var elemForm = new Form(elem);
    }
 
}

module.exports = Gator;
