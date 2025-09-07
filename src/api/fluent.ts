import api from '@/api/axios';
import type { AxiosRequestConfig } from 'axios';

export interface HttpResult<T = any> {
  data: T | undefined;
  status: number;
  headers: Record<string, any>;
  etag: string | null;
  notModified: boolean;
}

class FluentHttpClient {
  private _withCredentials = true;
  private _useEtag = false;
  private _ifNoneMatch: string | null = null;
  private _extraHeaders: Record<string, string> = {};

  /**
   * Enable cookie-based authentication
   * @returns 
   */
  auth(): this {
    this._withCredentials = true;
    return this;
  }

  /**
   * Disable cookie-based authentication
   * @returns 
   */
  anonymous(): this {
    this._withCredentials = false;
    return this;
  }

  /**
   * Enable ETag support
   * @param ifNoneMatch - If-None-Match header value
   * @returns 
   */
  withEtag(ifNoneMatch?: string): this {
    this._useEtag = true;
    this._ifNoneMatch = ifNoneMatch ?? null;
    return this;
  }

  /**
   * Add additional headers
   * @param headers - Additional headers
   * @returns 
   */
  withHeaders(headers: Record<string, string>): this {
    this._extraHeaders = { ...this._extraHeaders, ...headers };
    return this;
  }

  /**
   * Send a GET request
   * @param url - URL
   * @param params - Query parameters
   * @returns 
   */
  async get<T = any>(url: string, params?: Record<string, any>): Promise<HttpResult<T>> {
    return this.request<T>('get', url, undefined, params);
  }

  /**
   * Send a POST request
   * @param url - URL
   * @param body - Request body
   * @param params - Query parameters
   * @returns 
   */
  async post<T = any>(url: string, body?: any, params?: Record<string, any>): Promise<HttpResult<T>> {
    return this.request<T>('post', url, body, params);
  }

  /**
   * Send a PUT request
   * @param url - URL
   * @param body - Request body
   * @param params - Query parameters
   * @returns 
   */
  async put<T = any>(url: string, body?: any, params?: Record<string, any>): Promise<HttpResult<T>> {
    return this.request<T>('put', url, body, params);
  }

  /**
   * Send a PATCH request
   * @param url - URL
   * @param body - Request body
   * @param params - Query parameters
   * @returns 
   */
  async patch<T = any>(url: string, body?: any, params?: Record<string, any>): Promise<HttpResult<T>> {
    return this.request<T>('patch', url, body, params);
  }

  /**
   * Send a DELETE request
   * @param url - URL
   * @param params - Query parameters
   * @returns 
   */
  async delete<T = any>(url: string, params?: Record<string, any>): Promise<HttpResult<T>> {
    return this.request<T>('delete', url, undefined, params);
  }

  /**
   * Send a request
   * @param method - HTTP method
   * @param url - URL
   * @param data - Request body
   * @param params - Query parameters
   * @returns 
   */
  protected async request<T = any>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<HttpResult<T>> {
    const headers: Record<string, string> = { ...this._extraHeaders };

    if (this._useEtag && this._ifNoneMatch) {
      headers['If-None-Match'] = this._ifNoneMatch;
    }

    const validateStatus = this._useEtag
      ? (status: number) => (status >= 200 && status < 300) || status === 304
      : undefined;

    const configBase: AxiosRequestConfig = {
      method,
      url,
      params,
      data,
      headers,
      withCredentials: this._withCredentials,
    };
    const config: AxiosRequestConfig = this._useEtag
      ? { ...configBase, validateStatus }
      : configBase;

    try {
      const response = await api.request<T>(config);

      const isOkStatus = (response.status >= 200 && response.status < 300) || (this._useEtag && response.status === 304);
      if (!isOkStatus) {
        const payload: any = response.data as any;
        const apiError = Object.assign(new Error(
          (payload && (payload.message || payload.error || payload.title)) || `HTTP ${response.status}`
        ), {
          status: response.status,
          headers: response.headers as Record<string, any>,
          data: payload,
          url,
          method,
        });
        throw apiError;
      }

      const etagHeader = (response.headers?.etag ?? (response.headers as any)?.ETag ?? null) as string | null;

      return {
        data: response.status === 304 ? undefined : (response.data as unknown as T),
        status: response.status,
        headers: response.headers as Record<string, any>,
        etag: etagHeader,
        notModified: response.status === 304,
      };
    } catch (err: any) {
      // Нормализуем и пробрасываем ошибку дальше, чтобы верхние уровни могли корректно обработать
      const status = err?.response?.status ?? 0;
      const headers = (err?.response?.headers ?? {}) as Record<string, any>;
      const data = err?.response?.data;
      const apiError = Object.assign(new Error(
        (data && (data.message || data.error || data.title)) || err?.message || 'Request failed'
      ), {
        status,
        headers,
        data,
        url,
        method,
      });
      throw apiError;
    }
  }
}

export const httpFluent = () => new FluentHttpClient();

export default FluentHttpClient;


