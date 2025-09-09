import MaterialType from "@/models/MaterialType";
import MaterialUnit from "@/models/MaterialUnit";
import BackgroundTaskManager from "../BackgroundTaskManager";
import { useMaterialTypeStore } from "@/stores/useMaterialTypeStore";
import { useMaterialUnitStore } from "@/stores/useMaterialUnitStore";
import MaterialBrand from "@/models/MaterialBrand";
import { useMaterialBrandStore } from "@/stores/useMaterialBrandStore";
import { useMaterialPropertyStore } from "@/stores/useMaterialPropertyStore";
import MaterialProperty from "@/models/MaterialProperty";

export function refreshLibraries() {

    BackgroundTaskManager.instance().enqueue({
        id: 'refresh-libraries',
        run: async () => {
            const materialTypeStore = useMaterialTypeStore();
            const materialUnitStore = useMaterialUnitStore();
            const materialBrandStore = useMaterialBrandStore();
            const materialPropertyStore = useMaterialPropertyStore();

            const [typesCollection, unitsCollection, brandsCollection, propertiesCollection] = await Promise.all([
                MaterialType.fetchAll(),
                MaterialUnit.fetchAll(),
                MaterialBrand.fetchAll(),
                MaterialProperty.fetchAll(),
            ]);

            materialTypeStore.types = typesCollection;
            materialUnitStore.units = unitsCollection;
            materialBrandStore.brands = brandsCollection;
            materialPropertyStore.properties = propertiesCollection;
        }
    });
}