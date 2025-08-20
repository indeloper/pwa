import api from './axios';

// GET - получение данных
export const httpGet = async <T = any>(url: string, config?: any): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

// POST - создание новых данных
export const httpPost = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

// PUT - полное обновление данных
export const httpPut = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

// PATCH - частичное обновление данных
export const httpPatch = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.patch<T>(url, data, config);
  return response.data;
};

// DELETE - удаление данных
export const httpDelete = async <T = any>(url: string, config?: any): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

// Методы с авторизацией
export const httpGetAuth = async <T = any>(url: string, config?: any): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

export const httpPostAuth = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

export const httpPutAuth = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

export const httpPatchAuth = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.patch<T>(url, data, config);
  return response.data;
};

export const httpDeleteAuth = async <T = any>(url: string, config?: any): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

// Экспортируем все методы в одном объекте
export const http = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
  // Методы с авторизацией
  getAuth: httpGetAuth,
  postAuth: httpPostAuth,
  putAuth: httpPutAuth,
  patchAuth: httpPatchAuth,
  deleteAuth: httpDeleteAuth,
};

export default http;
