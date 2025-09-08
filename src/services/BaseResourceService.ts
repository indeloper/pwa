import BaseResourceApi from "@/api/BaseResourceApi";
import { ModelsTransformStrategies as Strategy } from "@/enums";

// Универсальный сервис, адаптирующий сырые данные API в модели/коллекции
export default class BaseResourceService {

    public modelCtor: any;

    constructor(modelCtor: any) {
        this.modelCtor = modelCtor;
    }

    async fetchAll(): Promise<any> {
        const api = new BaseResourceApi(this.modelCtor);
        const raw = await api.fetchAll();
        const items = Array.isArray(raw) ? raw.map((r: any) => this.modelCtor.from(Strategy.API_RESPONSE, r)) : [];
        return this.modelCtor.collect(items);
    }

    async fetchOne(id: number | string): Promise<any> {
        const api = new BaseResourceApi(this.modelCtor);
        const raw = await api.fetchOne(id);
        return this.modelCtor.from(Strategy.API_RESPONSE, raw);
    }

    async store(modelInstance: any): Promise<any> {
        const api = new BaseResourceApi(this.modelCtor);
        const raw = await api.store(modelInstance);
        return this.modelCtor.from(Strategy.API_RESPONSE, raw);
    }

    async update(modelInstance: any): Promise<any> {
        const api = new BaseResourceApi(this.modelCtor);
        const raw = await api.update(modelInstance);
        return this.modelCtor.from(Strategy.API_RESPONSE, raw);
    }

    async destroy(modelInstance: any): Promise<void> {
        const api = new BaseResourceApi(this.modelCtor);
        await api.destroy(modelInstance);
    }
}