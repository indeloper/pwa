import { useAuthApi } from "@/composables";
import BaseCollection from "@/models/BaseCollection";
import { httpFluent, type HttpResult } from "@/api/fluent";
import * as etagDb from "@/api/etagDb";

export type RequestParams = Record<string, any> | undefined;
export type RequestHeaders = Record<string, string> | undefined;

export interface EtagOptions {
    auth?: boolean;            // по умолчанию true (cookie-based)
    cacheKey?: string | null;  // ключ кэша; по умолчанию — полный URL с query
    headers?: RequestHeaders;  // доп. заголовки
}

export interface EventStreamHandlers<T = any> {
    onOpen?: (ev: Event) => void;
    onError?: (ev: Event) => void;
    onMessage?: (data: T, ev: MessageEvent) => void;
    events?: Record<string, (data: any, ev: MessageEvent) => void>;
    withCredentials?: boolean; // по умолчанию true (cookie-based)
    params?: RequestParams;    // query-параметры к URL
}

export default abstract class BaseApi<T> {
    protected api: ReturnType<typeof useAuthApi>;
    protected baseUrl: string;

    constructor() {
        this.api = useAuthApi();
        this.baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000/api";
    }

    // По умолчанию не реализованы — переопределяйте при необходимости в наследниках
    async fetchAll(): Promise<any[]> {
        throw new Error('fetchAll not implemented');
    }
    async fetchOne(_id: number): Promise<T> {
        throw new Error('fetchOne not implemented');
    }
    async update(_model: T): Promise<T> {
        throw new Error('update not implemented');
    }

    // ------------------------
    // Базовые утилиты
    // ------------------------
    protected resolveUrl(pathOrUrl: string, params?: RequestParams): string {
        const isAbs = /^https?:\/\//i.test(pathOrUrl);
        const base = this.baseUrl.replace(/\/+$/, "");
        let url = isAbs ? pathOrUrl : `${base}/${pathOrUrl.replace(/^\/+/, "")}`;
        if (params && Object.keys(params).length > 0) {
            try {
                const usp = new URLSearchParams();
                Object.entries(params).forEach(([k, v]) => {
                    if (v !== undefined && v !== null) usp.append(k, String(v));
                });
                const qs = usp.toString();
                if (qs) url += (url.includes("?") ? "&" : "?") + qs;
            } catch { }
        }
        return url;
    }

    protected async invalidateCache(keys: string | string[]): Promise<void> {
        const arr = Array.isArray(keys) ? keys : [keys];
        for (const key of arr) {
            try { await etagDb.invalidate(key); } catch { }
        }
    }

    protected extractPayload<R = any>(data: any): R {
        return (data && typeof data === 'object' && 'data' in data) ? (data as any).data as R : (data as R);
    }

    // ------------------------
    // HTTP методы
    // ------------------------
    protected async getJson<R = any>(pathOrUrl: string, params?: RequestParams, opts?: { auth?: boolean; headers?: RequestHeaders }): Promise<R> {
        const fullUrl = this.resolveUrl(pathOrUrl, params);
        const client = httpFluent();
        const caller = (opts?.auth === false ? client.anonymous() : client.auth());
        if (opts?.headers) caller.withHeaders(opts.headers);
        const res = await caller.get<R>(fullUrl);
        return res.data as R;
    }

    protected async postJson<R = any>(pathOrUrl: string, body?: any, params?: RequestParams, opts?: { auth?: boolean; headers?: RequestHeaders }): Promise<R> {
        const fullUrl = this.resolveUrl(pathOrUrl, params);
        const client = httpFluent();
        const caller = (opts?.auth === false ? client.anonymous() : client.auth());
        if (opts?.headers) caller.withHeaders(opts.headers);
        try {
            const res = await caller.post<R>(fullUrl, body);
            return res.data as R;
        } catch (error) {
            console.error('Error posting JSON:', error);
            throw error;
        }
    }

    protected async putJson<R = any>(pathOrUrl: string, body?: any, params?: RequestParams, opts?: { auth?: boolean; headers?: RequestHeaders }): Promise<R> {
        const fullUrl = this.resolveUrl(pathOrUrl, params);
        const client = httpFluent();
        const caller = (opts?.auth === false ? client.anonymous() : client.auth());
        if (opts?.headers) caller.withHeaders(opts.headers);
        const res = await caller.put<R>(fullUrl, body);
        return res.data as R;
    }

    protected async patchJson<R = any>(pathOrUrl: string, body?: any, params?: RequestParams, opts?: { auth?: boolean; headers?: RequestHeaders }): Promise<R> {
        const fullUrl = this.resolveUrl(pathOrUrl, params);
        const client = httpFluent();
        const caller = (opts?.auth === false ? client.anonymous() : client.auth());
        if (opts?.headers) caller.withHeaders(opts.headers);
        const res = await caller.patch<R>(fullUrl, body);
        return res.data as R;
    }

    protected async deleteJson<R = any>(pathOrUrl: string, params?: RequestParams, opts?: { auth?: boolean; headers?: RequestHeaders }): Promise<R> {
        const fullUrl = this.resolveUrl(pathOrUrl, params);
        const client = httpFluent();
        const caller = (opts?.auth === false ? client.anonymous() : client.auth());
        if (opts?.headers) caller.withHeaders(opts.headers);
        const res = await caller.delete<R>(fullUrl);
        return res.data as R;
    }

    // ------------------------
    // GET c ETag и управлением кэшем (IndexedDB)
    // ------------------------
    protected async getEtagCached<R = any>(pathOrUrl: string, params?: RequestParams, options?: EtagOptions): Promise<{ result: HttpResult<R>; data: R | null; cacheKey: string }> {
        const fullUrl = this.resolveUrl(pathOrUrl, params);
        const cacheKey = options?.cacheKey ?? fullUrl;
        const prevTag = await etagDb.getEtag(cacheKey);

        const client = httpFluent();
        const caller = (options?.auth === false ? client.anonymous() : client.auth());
        if (options?.headers) caller.withHeaders(options.headers);
        const res = await caller.withEtag(prevTag ?? undefined).get<R>(fullUrl);

        if (res.notModified) {
            const cached = await etagDb.getData(cacheKey);
            return { result: res, data: (cached as R) ?? null, cacheKey };
        }

        if (res.etag && res.data !== undefined) {
            try { await etagDb.set(cacheKey, res.etag, res.data); } catch { }
        }
        return { result: res, data: (res.data as R) ?? null, cacheKey };
    }

    // ------------------------
    // Server-Sent Events (EventSource)
    // ------------------------
    protected openEventStream<T = any>(pathOrUrl: string, handlers?: EventStreamHandlers<T>): { eventSource: EventSource; close: () => void } {
        const fullUrl = this.resolveUrl(pathOrUrl, handlers?.params);
        const es = new EventSource(fullUrl, { withCredentials: handlers?.withCredentials ?? true });

        if (handlers?.onOpen) es.onopen = handlers.onOpen;

        if (handlers?.events) {
            for (const [eventName, fn] of Object.entries(handlers.events)) {
                es.addEventListener(eventName, (ev: MessageEvent) => {
                    try {
                        fn(JSON.parse(ev.data), ev);
                    } catch {
                        fn((ev.data as unknown as any), ev);
                    }
                });
            }
        }

        es.onmessage = (ev) => {
            try {
                handlers?.onMessage?.(JSON.parse(ev.data) as T, ev);
            } catch {
                handlers?.onMessage?.((ev.data as unknown) as T, ev);
            }
        };

        if (handlers?.onError) es.onerror = handlers.onError;

        return {
            eventSource: es,
            close: () => es.close(),
        };
    }
}