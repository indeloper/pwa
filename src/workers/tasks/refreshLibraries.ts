import MaterialType from "@/models/MaterialType";
import MaterialUnit from "@/models/MaterialUnit";
import BackgroundTaskManager from "../BackgroundTaskManager";
import { useMaterialTypeStore } from "@/stores/useMaterialTypeStore";
import { useMaterialUnitStore } from "@/stores/useMaterialUnitStore";
import MaterialBrand from "@/models/MaterialBrand";
import { useMaterialBrandStore } from "@/stores/useMaterialBrandStore";
import { useMaterialPropertyStore } from "@/stores/useMaterialPropertyStore";
import MaterialProperty from "@/models/MaterialProperty";
import { useWarehouseStore } from "@/stores/useWarehouseStore";
import Warehouse from "@/models/Warehouse";

export function refreshLibraries() {

    BackgroundTaskManager.instance().enqueue({
        id: 'refresh-libraries',
        run: async () => {
            const materialTypeStore = useMaterialTypeStore();
            const materialUnitStore = useMaterialUnitStore();
            const materialBrandStore = useMaterialBrandStore();
            const materialPropertyStore = useMaterialPropertyStore();
            const warehouseStore = useWarehouseStore();

            const [typesCollection, unitsCollection, brandsCollection, propertiesCollection, warehousesCollection] = await Promise.all([
                MaterialType.fetchAll(),
                MaterialUnit.fetchAll(),
                MaterialBrand.fetchAll(),
                MaterialProperty.fetchAll(),
                Warehouse.fetchAll(),
            ]);

            materialTypeStore.types = typesCollection;
            materialUnitStore.units = unitsCollection;
            materialBrandStore.brands = brandsCollection;
            materialPropertyStore.properties = propertiesCollection;
            warehouseStore.warehouses = warehousesCollection;
        }
    });
}