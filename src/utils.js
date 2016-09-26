
export function nl2arr(nodeList) {
    return Array.prototype.slice.call(nodeList);
};

// Mini PubSub by David Walsh.  
// https://davidwalsh.name/pubsub-javascript
export let pubSub = (() => {
  var topics = {};
  var hOP = topics.hasOwnProperty;
  return {
    subscribe: function(topic, listener) {
      if(!hOP.call(topics, topic)) topics[topic] = [];
      var index = topics[topic].push(listener) -1;
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    },
    publish: function(topic, info) {
      if(!hOP.call(topics, topic)) return;
      topics[topic].forEach(function(item) {
      		item(info != undefined ? info : {});
      });
    }
  };
})();

// Unique ID
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function getUniqueId() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

export function convertCamelCase(str) {
  return str.replace(/-([a-z])/g, 
    (s) => { 
      return s[1].toUpperCase(); 
    });
};

 