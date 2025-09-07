/// <reference path="../types/primevue-toasteventbus.d.ts" />
import toasteventbus from 'primevue/toasteventbus'

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastOptions {
    severity?: ToastSeverity;
    summary?: string;
    detail?: string;
    life?: number;
    closable?: boolean;
    sticky?: boolean;
    group?: string;
    icon?: string;
    styleClass?: string;
    [key: string]: any;
}

export function useToastMessage() {
    const baseDefaults: Required<Pick<ToastOptions, 'group' | 'life' | 'closable'>> = {
        group: 'toast',
        life: 3000,
        closable: true,
    };

    const notify = (options: ToastOptions) => {
        const payload = { ...baseDefaults, ...options };
        toasteventbus.emit('add', payload);
    };

    const notifySticky = (options: ToastOptions) => {
        notify({ sticky: true, life: 0, ...options });
    };

    const success = (detail: string, options: Partial<ToastOptions> = {}) => {
        notify({ severity: 'success', summary: 'Успешно', detail, ...options });
    };

    const info = (detail: string, options: Partial<ToastOptions> = {}) => {
        notify({ severity: 'info', summary: 'Информация', detail, ...options });
    };

    const warn = (detail: string, options: Partial<ToastOptions> = {}) => {
        notify({ severity: 'warn', summary: 'Внимание', detail, ...options });
    };

    const error = (detail: string, options: Partial<ToastOptions> = {}) => {
        notify({ severity: 'error', summary: 'Ошибка', detail, ...options });
    };

    // Совместимость с существующими вызовами
    const addSuccessMessage = (message: string, options?: Partial<ToastOptions>) => success(message, options);

    const addErrorMessage = (message: string, options?: Partial<ToastOptions>) => error(message, options);

    return {
        // Базовые абстракции
        notify,
        notifySticky,
        // Быстрые методы
        success,
        info,
        warn,
        error,
        // Совместимость
        addSuccessMessage,
        addErrorMessage,
    };
}