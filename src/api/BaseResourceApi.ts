import BaseApi from "./BaseApi";
import { ModelsTransformStrategies as Strategy } from "@/enums";

// Универсальный API, использующий метаданные Resource модели
// Возвращает СЫРЫЕ данные (payload), адаптацией занимается сервис
export default class BaseResourceApi extends BaseApi<any> {

    private modelCtor: any;

    constructor(modelCtor: any) {
        super(modelCtor as any);
        this.modelCtor = modelCtor;
    }

    async fetchAll(): Promise<any[]> {
        const methodPath = this.modelCtor.resourcePaths?.fetchAll;
        const path = typeof methodPath === 'function'
            ? methodPath({})
            : (typeof methodPath === 'string' ? methodPath : (this.modelCtor.resourcePath ?? (this.modelCtor.resource?.().path)));
        const { data } = await this.getEtagCached<any>(path);
        return data ? this.extractPayload<any[]>(data) : [];
    }
    
    async fetchOne(id: number | string): Promise<any> {
        const methodPath = this.modelCtor.resourcePaths?.fetchOne;
        const path = typeof methodPath === 'function'
            ? methodPath({ id })
            : (typeof methodPath === 'string'
                ? (methodPath.includes('{id}') || methodPath.includes(':id')
                    ? methodPath.replace('{id}', String(id)).replace(':id', String(id))
                    : `${methodPath}${methodPath.endsWith('/') ? '' : '/'}${id}`)
                : (typeof this.modelCtor.buildPath === 'function' ? this.modelCtor.buildPath(id) : `${this.modelCtor.resourcePath}/${id}`));
        const body = await this.getJson<{ data: any; message?: string }>(path);
        if (!body || typeof body !== 'object' || !('data' in body)) {
            throw new Error((body as any)?.message || 'Invalid response');
        }
        return this.extractPayload(body);
    }

    async store(modelInstance: any): Promise<any> {
        const methodPath = this.modelCtor.resourcePaths?.store;
        const path = typeof methodPath === 'function'
            ? methodPath({ model: modelInstance })
            : (typeof methodPath === 'string' ? methodPath : (this.modelCtor.resourcePath ?? (this.modelCtor.resource?.().path)));
        const payload = typeof modelInstance.to === 'function' ? modelInstance.to(Strategy.API_REQUEST) : modelInstance;
        const body = await this.postJson<{ data: any; message?: string }>(path, payload);
        if (!body || typeof body !== 'object' || !('data' in body)) {
            throw new Error((body as any)?.message || 'Invalid response');
        }
        return this.extractPayload(body);
    }

    async update(modelInstance: any): Promise<any> {
        const key: string = this.modelCtor.resourceKey ?? (this.modelCtor.resource?.().key);
        const id = modelInstance[key];
        const methodPath = this.modelCtor.resourcePaths?.update;
        const path = typeof methodPath === 'function'
            ? methodPath({ id, model: modelInstance })
            : (typeof methodPath === 'string'
                ? (methodPath.includes('{id}') || methodPath.includes(':id')
                    ? methodPath.replace('{id}', String(id)).replace(':id', String(id))
                    : `${methodPath}${methodPath.endsWith('/') ? '' : '/'}${id}`)
                : (typeof this.modelCtor.buildPath === 'function' ? this.modelCtor.buildPath(id) : `${this.modelCtor.resourcePath}/${id}`));
        const payload = typeof modelInstance.to === 'function' ? modelInstance.to(Strategy.API_REQUEST) : modelInstance;
        const body = await this.putJson<{ data: any; message?: string }>(path, payload);
        if (!body || typeof body !== 'object' || !('data' in body)) {
            throw new Error((body as any)?.message || 'Invalid response');
        }
        return this.extractPayload(body);
    }

    async destroy(modelInstance: any): Promise<void> {
        const key: string = this.modelCtor.resourceKey ?? (this.modelCtor.resource?.().key);
        const id = modelInstance[key];
        const methodPath = this.modelCtor.resourcePaths?.destroy;
        const path = typeof methodPath === 'function'
            ? methodPath({ id, model: modelInstance })
            : (typeof methodPath === 'string'
                ? (methodPath.includes('{id}') || methodPath.includes(':id')
                    ? methodPath.replace('{id}', String(id)).replace(':id', String(id))
                    : `${methodPath}${methodPath.endsWith('/') ? '' : '/'}${id}`)
                : (typeof this.modelCtor.buildPath === 'function' ? this.modelCtor.buildPath(id) : `${this.modelCtor.resourcePath}/${id}`));
        await this.deleteJson<any>(path);
    }
}