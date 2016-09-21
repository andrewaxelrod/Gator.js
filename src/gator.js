import Form from './form';
import Handshake from './handshake';

class Gator { 
 
    constructor() { 
        var elem = document.getElementById('customerForm');
        var handshake = Handshake;  
        var elemForm = new Form(elem);

        this.handShakes = {}; 
    } 

    handshake(topic, fn) {
        this.handShakes[topic] = fn;
        return this;
    }
 
}

module.exports = Gator;
 