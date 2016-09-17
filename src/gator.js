import Form from './form';
import Coordinator from './coordinator';

class Gator { 
 
    constructor() { 
        var elem = document.getElementById('customerForm');
        var coord = Coordinator;  
        var elemForm = new Form(elem);

        this.handShakes = {}; 
    } 

    handshake(topic, fn) {
        this.handShakes[topic] = fn;
        return this;
    }
 
}

module.exports = Gator;
 