import type { IModel } from "@/decorators";
import BaseCollection from "./BaseCollection";

export default class BaseResourceCollection<T extends IModel<T>> extends BaseCollection<T> {
    constructor(items: T[]) {
        super(items);
    }
}