import BackgroundTaskManager from "@/workers/BackgroundTaskManager";
import { useLoader } from "@/composables/useLoader";

export function enqueueDemoLoaderProgressTask(id: string = 'demo-loader') {
  BackgroundTaskManager.instance().enqueue({
    id: `demo-loader-${Date.now()}`,
    run: async () => {
      const { start, setValue, stop } = useLoader();
      // Три параллельных лоадера
      // start('loader-message', { message: 'Загрузка данных...' });
      // start('loader-percent', { percent: 0 });
      // start('loader-count', { count: 0, min: 0, max: 100 });

      const startedAt = Date.now();
      while (Date.now() - startedAt < 1500) {
        await new Promise((r) => setTimeout(r, 1000));
        // Обновляем все три
        // setValue('loader-message', { message: `Загрузка... ${new Date().toLocaleTimeString()}` });
        // setValue('loader-percent', { percent: Math.min(100, ((Date.now() - startedAt) / 15000) * 100) });
        // setValue('loader-count', (Math.min(100, Math.floor((Date.now() - startedAt) / 150))) as number);
      }

      // stop('loader-message', 'Ошибка', 2000, 'error');
      // stop('loader-percent', 'Готово', 2000, 'success');
      // stop('loader-count', 'Готово', 2000, 'success');
    },
  });
}


