function deepEqual(a, b, visited = new WeakMap()) {
  if (Object.is(a, b)) return true;

  // Handle null/undefined and primitive types
  if (typeof a !== 'object' || a === null ||
      typeof b !== 'object' || b === null) {
    return false;
  }

  // Handle circular references
  if (visited.has(a)) return visited.get(a) === b;
  visited.set(a, b);

  // Handle Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  // Handle Array
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], visited)) return false;
    }
    return true;
  }

  // If one is array and the other is not
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Handle Function (compare by reference)
  if (typeof a === 'function' || typeof b === 'function') {
    return false; // or: return a === b;
  }

  // Handle all other objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key], visited)) return false;
  }
  return true;
}

export default deepEqual; 