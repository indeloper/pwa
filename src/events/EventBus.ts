export type EventHandler<T = any> = (payload: T) => void;

class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();

  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler as EventHandler);
    return () => this.off(event, handler as EventHandler);
  }

  off(event: string, handler: EventHandler): void {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this.listeners.delete(event);
  }

  emit<T = any>(event: string, payload: T): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const handler of Array.from(set)) {
      try {
        (handler as EventHandler<T>)(payload);
      } catch (err) {
        // Не блокируем других слушателей
        // eslint-disable-next-line no-console
        console.error('[EventBus] handler error for', event, err);
      }
    }
  }
}

const eventBus = new EventBus();
export default eventBus;


