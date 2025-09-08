import MaterialType from "@/models/MaterialType";
import MaterialUnit from "@/models/MaterialUnit";
import BackgroundTaskManager from "../BackgroundTaskManager";
import { useMaterialTypeStore } from "@/stores/useMaterialTypeStore";
import { useMaterialUnitStore } from "@/stores/useMaterialUnitStore";

export function refreshLibraries() {

    BackgroundTaskManager.instance().enqueue({
        id: 'refresh-libraries',
        run: async () => {
            const materialTypeStore = useMaterialTypeStore();
            const materialUnitStore = useMaterialUnitStore();

            const [typesCollection, unitsCollection] = await Promise.all([
                MaterialType.fetchAll(),
                MaterialUnit.fetchAll(),
            ]);

            materialTypeStore.types = typesCollection;
            materialUnitStore.units = unitsCollection;
        }
    });
}