import { ref } from 'vue';
import eventBus from '@/events/EventBus';

export type LoaderData = {
  message?: string;
  percent?: number;
  count?: number;
  min?: number;
  max?: number;
};

export type LoaderStartPayload = { id: string; data?: LoaderData };
export type LoaderUpdatePayload = { id: string; data: Partial<LoaderData> };
export type LoaderStopPayload = { id: string; finalMessage?: string; durationMs?: number; finalStatus?: 'success' | 'error' };

const EVENT_START = 'loader:start';
const EVENT_UPDATE = 'loader:update';
const EVENT_STOP = 'loader:stop';

function normalizeData(input?: number | LoaderData): LoaderData | undefined {
  if (input === undefined) return undefined;
  if (typeof input === 'number') return { count: input };
  return input;
}

export function useLoader() {
  const start = (id: string, data?: number | LoaderData) => {
    eventBus.emit<LoaderStartPayload>(EVENT_START, { id, data: normalizeData(data) });
  };

  const setValue = (id: string, data: number | Partial<LoaderData>) => {
    const normalized = typeof data === 'number' ? { count: data } : data;
    eventBus.emit<LoaderUpdatePayload>(EVENT_UPDATE, { id, data: normalized });
  };

  const stop = (id: string, finalMessage?: string, durationMs?: number, finalStatus?: 'success' | 'error') => {
    eventBus.emit<LoaderStopPayload>(EVENT_STOP, { id, finalMessage, durationMs, finalStatus });
  };

  const onStart = (handler: (p: LoaderStartPayload) => void) => eventBus.on(EVENT_START, handler);
  const onUpdate = (handler: (p: LoaderUpdatePayload) => void) => eventBus.on(EVENT_UPDATE, handler);
  const onStop = (handler: (p: LoaderStopPayload) => void) => eventBus.on(EVENT_STOP, handler);

  return { start, setValue, stop, onStart, onUpdate, onStop };
}


