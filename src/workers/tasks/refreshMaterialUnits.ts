import { useLoader } from "@/composables/useLoader";
import { useToastMessage } from "@/composables/useToastMessage";
import BackgroundTaskManager from "@/workers/BackgroundTaskManager";
import { useMaterialUnitStore } from "@/stores/useMaterialUnitStore";
import MaterialUnit from "@/models/MaterialUnit";

export function enqueueRefreshMaterialUnitsTask(options?: { silent?: boolean }) {

    const { addSuccessMessage, addErrorMessage } = useToastMessage();

    const { start, setValue, stop } = useLoader();

    BackgroundTaskManager.instance().enqueue({
        id: `refresh-material-units-${Date.now()}`,
        run: async () => {
            try {
                start('loader-message', { message: 'Обновление единиц измерения...' });
                const collection = await MaterialUnit.fetchAll();
                const store = useMaterialUnitStore();
                store.units = collection;
                store.unitsLoading = false;
                if (!options?.silent) {
                    console.log("[BackgroundTask] Store refreshed: material units");
                }
                stop('loader-message', 'Готово', 2000, 'success');
            } catch (err) {
                console.error("[BackgroundTask] Failed to refresh material units", err);
                addErrorMessage("Не удалось обновить единицы измерения", { group: 'system-toast' });
                stop('loader-message', 'Ошибка', 2000, 'error');
                throw err;
            }
        },
    });
}


