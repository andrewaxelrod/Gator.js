
export function nl2arr(nodeList) {
    return Array.prototype.slice.call(nodeList);
};


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

function isElement(obj) {
    return (obj[0] || obj).nodeType
}

 