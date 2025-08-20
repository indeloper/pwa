import { useAuthApi } from "@/composables";
import BaseCollection from "@/models/BaseCollection";

export default abstract class BaseApi<T> {
    protected api: ReturnType<typeof useAuthApi>;

    constructor() {
        this.api = useAuthApi()
    }

    abstract fetchAll(id?: number): Promise<BaseCollection<T>>;
    abstract fetchOne(id: number): Promise<T>;
    abstract update(model: T): Promise<T>;
}