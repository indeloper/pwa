import { v4 as uuidv4 } from 'uuid';

export function WithUuid() {
  return function <T extends new (...args: any[]) => {}>(Base: T) {
    return class extends Base {
      uuid: string = uuidv4();
    };
  };
}