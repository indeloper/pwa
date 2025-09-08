import BackgroundTaskManager from "@/workers/BackgroundTaskManager";
import { useLoader } from "@/composables/useLoader";
import { useToastMessage } from "@/composables/useToastMessage";

interface RefreshResourceOptions<TCollection = any> {
    modelCtor: any; // класс модели с static fetchAll()
    update: (collection: TCollection) => void; // как применить коллекцию в сторе
    setLoading?: (value: boolean) => void;     // опционально: управление загрузкой стора
    title?: string;                             // заголовок/человекочитаемое имя ресурса для сообщений
    silent?: boolean;                           // скрыть тосты/логи
}

export function enqueueRefreshResourceTask<TCollection = any>(options: RefreshResourceOptions<TCollection>) {
    const { start, stop } = useLoader();
    const { addErrorMessage } = useToastMessage();

    const title = options.title ?? "Данные";

    BackgroundTaskManager.instance().enqueue({
        id: `refresh-resource-${Date.now()}`,
        run: async () => {
            try {
                start('loader-message', { message: `Обновление: ${title}...` });
                if (options.setLoading) options.setLoading(true);

                const collection = await options.modelCtor.fetchAll();
                options.update(collection as unknown as TCollection);

                if (!options.silent) {
                    // намеренно только лог; визуальные тосты можно добавить по желанию
                    // console.log(`[BackgroundTask] Store refreshed: ${title}`);
                }
                stop('loader-message', 'Готово', 1200, 'success');
            } catch (err) {
                addErrorMessage(`Не удалось обновить: ${title}`, { group: 'system-toast' });
                stop('loader-message', 'Ошибка', 1600, 'error');
                throw err;
            } finally {
                if (options.setLoading) options.setLoading(false);
            }
        },
    });
}


