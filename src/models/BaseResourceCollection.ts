
import BaseCollection from "./BaseCollection";

export default class BaseResourceCollection<T> extends BaseCollection<T> {
    constructor(items: T[]) {
        super(items);
    }
}