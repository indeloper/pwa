import { ModelsTransformStrategies as Strategy } from "@/enums";
import BaseApi from "@/api/BaseApi";
import BaseResourceService from "@/services/BaseResourceService";

export interface ResourceConfig {
    path: string;
    key: string;
    store?: string | (() => any);
}

export type ResourceCrudMethod = 'fetchAll' | 'fetchOne' | 'store' | 'update' | 'destroy';

export interface ResourceOptions extends ResourceConfig {
    // Кастомный сервис/АПИ (классы). Необязательны.
    serviceClass?: any;
    apiClass?: any;
    // Управление набором методов
    only?: ResourceCrudMethod[];
    exclude?: ResourceCrudMethod[];
    // Переопределение путей для методов
    paths?: Partial<Record<ResourceCrudMethod, string | ((ctx: { id?: number | string; model?: any }) => string)>>;
}

export interface IResourceStatic {
    resource(): ResourceConfig;
    readonly resourcePath: string;
    readonly resourceKey: string;
    buildPath(id?: string | number): string;
}

export interface IResourceInstance {
    getResourcePath(): string;
    getResourceKey(): string;
    getResourceStore(): any;
}

export function Resource(configOrOptions: ResourceConfig | ResourceOptions) {
    return function (target: any) {
        const options = configOrOptions as ResourceOptions;

        // static: Model.resource() → { path, key }
        Object.defineProperty(target, 'resource', {
            value: () => ({ path: options.path, key: options.key, store: options.store }),
            writable: false,
            configurable: false,
        });

        // static getters
        Object.defineProperty(target, 'resourcePath', {
            get: () => options.path,
            configurable: false,
        });
        Object.defineProperty(target, 'resourceKey', {
            get: () => options.key,
            configurable: false,
        });

        Object.defineProperty(target, 'resourceStore', {
            get: () => typeof options.store === 'function' ? options.store() : options.store,
            configurable: false,
        });

        // static overrides: Model.resourcePaths (для использования в универсальном API)
        if (options.paths) {
            Object.defineProperty(target, 'resourcePaths', {
                value: options.paths,
                writable: false,
                configurable: false,
            });
        }

        // static helper: Model.buildPath(id?)
        Object.defineProperty(target, 'buildPath', {
            value: (id?: string | number) =>
                id === undefined || id === null ? options.path : `${options.path}/${id}`,
            writable: false,
            configurable: false,
        });

        // instance helpers
        Object.defineProperty(target.prototype, 'getResourcePath', {
            value: () => options.path,
            writable: false,
            configurable: false,
        });
        Object.defineProperty(target.prototype, 'getResourceKey', {
            value: () => options.key,
            writable: false,
            configurable: false,
        });
        Object.defineProperty(target.prototype, 'getResourceStore', {
            value: () => typeof options.store === 'function' ? options.store() : options.store,
            writable: false,
            configurable: false,
        });
        // Привязка сервис/АПИ классов (опционально)
        if (options.serviceClass && !target.resourceService) {
            Object.defineProperty(target, 'resourceService', {
                value: options.serviceClass,
                writable: false,
                configurable: false,
            });
        }
        if (options.apiClass && !target.resourceApiClass) {
            Object.defineProperty(target, 'resourceApiClass', {
                value: options.apiClass,
                writable: false,
                configurable: false,
            });
        }

        // Вспомогательные резолверы
        const resolveApi = () => {
            // Предпочтение: статический api у модели (если есть)
            if (target.api) return target.api;
            // затем apiClass, если передан в декоратор
            if (target.resourceApiClass) return new target.resourceApiClass();
            return null;
        };

        const resolveService = () => {
            const svcClass = target.resourceService ?? BaseResourceService;
            let svcInstance: any = null;
            try { svcInstance = new svcClass(target); } catch { /* ignore */ }
            return { svcClass, svcInstance };
        };

        // Note: service method existence is checked inline where needed via resolveService()

        // Переопределение путей на уровне декоратора
        const replaceIdToken = (path: string, id: string | number): string => {
            if (path.includes('{id}')) return path.replace('{id}', String(id));
            if (path.includes(':id')) return path.replace(':id', String(id));
            const sep = path.endsWith('/') ? '' : '/';
            return `${path}${sep}${id}`;
        };

        const resolveMethodPath = (method: ResourceCrudMethod, id?: string | number, modelInstance?: any): string => {
            const override = options.paths?.[method];
            if (typeof override === 'function') {
                return override({ id, model: modelInstance });
            }
            if (typeof override === 'string') {
                if (id !== undefined && id !== null) return replaceIdToken(override, id);
                return override;
            }
            // По умолчанию используем базовый path
            if (id !== undefined && id !== null) return replaceIdToken(options.path, id);
            return options.path;
        };

        // Минимальный HTTP-клиент на базе BaseApi для fallback-логики
        class ResourceHttp extends BaseApi<any> {
            constructor(model: any) { super(model); }
            public getEtagCachedPublic<R = any>(pathOrUrl: string, params?: any, options?: any) { return this.getEtagCached<R>(pathOrUrl, params, options); }
            public getJsonPublic<R = any>(pathOrUrl: string, params?: any, opts?: any) { return this.getJson<R>(pathOrUrl, params, opts); }
            public postJsonPublic<R = any>(pathOrUrl: string, body?: any, params?: any, opts?: any) { return this.postJson<R>(pathOrUrl, body, params, opts); }
            public putJsonPublic<R = any>(pathOrUrl: string, body?: any, params?: any, opts?: any) { return this.putJson<R>(pathOrUrl, body, params, opts); }
            public deleteJsonPublic<R = any>(pathOrUrl: string, params?: any, opts?: any) { return this.deleteJson<R>(pathOrUrl, params, opts); }
        }
        const createHttp = () => new ResourceHttp(target);

        const extractPayload = (data: any): any => {
            return (data && typeof data === 'object' && 'data' in data) ? (data as any).data : data;
        };

        const isAllowed = (name: ResourceCrudMethod): boolean => {
            if (Array.isArray(options.only)) return options.only.includes(name);
            if (Array.isArray(options.exclude)) return !options.exclude.includes(name);
            return true;
        };

        // ----------------------
        // Статические CRUD-методы
        // ----------------------
        if (isAllowed('fetchAll') && !('fetchAll' in target)) {
            Object.defineProperty(target, 'fetchAll', {
                value: async function () {
                    const { svcClass, svcInstance } = resolveService();
                    if (svcClass && typeof svcClass.fetchAll === 'function') return await svcClass.fetchAll();
                    if (svcInstance && typeof svcInstance.fetchAll === 'function') return await svcInstance.fetchAll();
                    const api = resolveApi();
                    if (api && typeof api.fetchAll === 'function') {
                        const raw = await api.fetchAll();
                        const items = Array.isArray(raw) ? raw.map((r: any) => target.from(Strategy.API_RESPONSE, r)) : [];
                        return target.collect(items);
                    }
                    // Fallback: прямой вызов по пути
                    const http = createHttp();
                    const path = resolveMethodPath('fetchAll');
                    const { data } = await http.getEtagCachedPublic<any>(path);
                    const arr = Array.isArray(extractPayload(data)) ? extractPayload(data) : [];
                    const items = arr.map((r: any) => target.from(Strategy.API_RESPONSE, r));
                    return target.collect(items);
                },
                writable: false,
                configurable: false,
            });
        }

        if (isAllowed('fetchOne') && !('fetchOne' in target)) {
            Object.defineProperty(target, 'fetchOne', {
                value: async function (id: number | string) {
                    const { svcClass, svcInstance } = resolveService();
                    if (svcClass && typeof svcClass.fetchOne === 'function') return await svcClass.fetchOne(id);
                    if (svcInstance && typeof svcInstance.fetchOne === 'function') return await svcInstance.fetchOne(id);
                    const api = resolveApi();
                    if (api && typeof api.fetchOne === 'function') {
                        const raw = await api.fetchOne(id);
                        if (raw && raw.constructor === target) return raw;
                        return target.from(Strategy.API_RESPONSE, raw);
                    }
                    // Fallback: прямой вызов по пути
                    const http = createHttp();
                    const path = resolveMethodPath('fetchOne', id);
                    const body = await http.getJsonPublic<any>(path);
                    const raw = extractPayload(body);
                    return target.from(Strategy.API_RESPONSE, raw);
                },
                writable: false,
                configurable: false,
            });
        }

        if (isAllowed('store') && !('store' in target)) {
            Object.defineProperty(target, 'store', {
                value: async function (model: any) {
                    const { svcClass, svcInstance } = resolveService();
                    if (svcClass && typeof svcClass.store === 'function') return await svcClass.store(model);
                    if (svcInstance && typeof svcInstance.store === 'function') return await svcInstance.store(model);
                    const api = resolveApi();
                    if (api && typeof api.store === 'function') {
                        const body = await api.store(model.to ? model.to(Strategy.API_REQUEST) : model);
                        if (body && body.constructor === target) return body;
                        return target.from(Strategy.API_RESPONSE, body);
                    }
                    // Fallback: прямой вызов по пути
                    const http = createHttp();
                    const path = resolveMethodPath('store');
                    const body = await http.postJsonPublic<any>(path, model.to ? model.to(Strategy.API_REQUEST) : model);
                    const raw = extractPayload(body);
                    return target.from(Strategy.API_RESPONSE, raw);
                },
                writable: false,
                configurable: false,
            });
        }

        // ----------------------
        // Экземплярные CRUD-методы
        // ----------------------
        if (isAllowed('update') && !('update' in target.prototype)) {
            Object.defineProperty(target.prototype, 'update', {
                value: async function () {
                    const { svcClass, svcInstance } = resolveService();
                    if (svcClass && typeof svcClass.update === 'function') return await svcClass.update(this);
                    if (svcInstance && typeof svcInstance.update === 'function') return await svcInstance.update(this);
                    const api = resolveApi();
                    if (api && typeof api.update === 'function') {
                        const body = await api.update(this.to ? this.to(Strategy.API_REQUEST) : this);
                        if (body && body.constructor === target) return body;
                        return target.from(Strategy.API_RESPONSE, body);
                    }
                    // Fallback: прямой вызов по пути
                    const http = createHttp();
                    const id = (this as any)[target.resourceKey];
                    const path = resolveMethodPath('update', id, this);
                    const body = await http.putJsonPublic<any>(path, this.to ? this.to(Strategy.API_REQUEST) : this);
                    const raw = extractPayload(body);
                    return target.from(Strategy.API_RESPONSE, raw);
                },
                writable: false,
                configurable: false,
            });
        }

        if (isAllowed('destroy') && !('destroy' in target.prototype)) {
            Object.defineProperty(target.prototype, 'destroy', {
                value: async function () {
                    const { svcClass, svcInstance } = resolveService();
                    if (svcClass && typeof svcClass.destroy === 'function') return await svcClass.destroy(this);
                    if (svcInstance && typeof svcInstance.destroy === 'function') return await svcInstance.destroy(this);
                    const api = resolveApi();
                    if (api && typeof api.destroy === 'function') {
                        return await api.destroy(this.to ? this.to(Strategy.API_REQUEST) : this);
                    }
                    // Fallback: прямой вызов по пути
                    const http = createHttp();
                    const id = (this as any)[target.resourceKey];
                    const path = resolveMethodPath('destroy', id, this);
                    await http.deleteJsonPublic<any>(path);
                    return;
                },
                writable: false,
                configurable: false,
            });
        }
    };
}