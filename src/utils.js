
export function nl2arr(nodeList) {
    return Array.prototype.slice.call(nodeList);
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

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param {Object} obj1
 * @param {Object} obj2
 */
export function extend(obj1,obj2){
    for (let attrname in obj2) { 
        if(obj2.hasOwnProperty(attrname)) {
            obj1[attrname] = obj2[attrname];    
        }
    }
    return obj1; 
}