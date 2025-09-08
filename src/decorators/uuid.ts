import { v4 as uuidv4 } from 'uuid';

export function Uuid() {
  return function (target: any, key: string) {
    const store = Symbol(`__${key}`);
    Object.defineProperty(target, key, {
      get() {
        if (!this[store]) this[store] = uuidv4();
        return this[store];
      },
      set(v: string) { this[store] = v; },
      enumerable: true,
      configurable: true
    });
  };
}