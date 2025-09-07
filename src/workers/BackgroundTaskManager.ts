type Task = {
  id: string;
  run: () => Promise<void> | void;
};

class BackgroundTaskManager {
  private static _instance: BackgroundTaskManager | null = null;
  private queue: Task[] = [];
  private running = false;

  static instance(): BackgroundTaskManager {
    if (!this._instance) this._instance = new BackgroundTaskManager();
    return this._instance;
  }

  enqueue(task: Task): void {
    this.queue.push(task);
    void this.process();
  }

  private async process(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      while (this.queue.length > 0) {
        const task = this.queue.shift()!;
        try {
          await task.run();
        } catch (err) {
          console.error('[BackgroundTaskManager] Task failed:', task.id, err);
        }
      }
    } finally {
      this.running = false;
    }
  }
}

export default BackgroundTaskManager;


