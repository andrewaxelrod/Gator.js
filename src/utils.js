
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

export function isElement(obj) { 
    return (obj[0] || obj).nodeType
}

export function getName(elem) {
    return elem && elem.hasAttribute('name') ? elem.name : null;
}

export function getAttribute(elem, attribute) {
    return elem && elem.hasAttribute('gt-' + attribute) ? elem.getAttribute('gt-' + attribute) : null;
} 

export const log = { 
    error(msg) {
        throw new Error(msg);
    },
    warn(msg) {
        throw new Warning(msg);
    }
}
 