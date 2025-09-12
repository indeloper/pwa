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
import { useLocalStorage } from "@vueuse/core";
import { useMaterialOperationReasonStore } from "@/stores/useMaterialOperationReasonStore";
import { useMaterialOperationTypeStore } from "@/stores/useMaterialOperationTypeStore";
import MaterialOperationType from "@/models/MaterialOperationType";
import MaterialOperationReason from "@/models/MaterialOperationReason";
import { useUserStore } from "@/stores/useUserStore";
import User from "@/models/User";
import { useMaterialStore } from "@/stores/useMaterialStore";
import Material from "@/models/Material";
import MaterialMoveType from "@/models/MaterialMoveType";
import { useMaterialMoveTypeStore } from "@/stores/useMaterialMoveTypeStore";
import { useContractorStore } from "@/stores/useContractorStore";
import Contractor from "@/models/Contractor";

export function refreshLibraries() {

    BackgroundTaskManager.instance().enqueue({
        id: 'refresh-libraries',
        run: async () => {
            const materialTypeStore = useMaterialTypeStore();
            const materialUnitStore = useMaterialUnitStore();
            const materialBrandStore = useMaterialBrandStore();
            const materialPropertyStore = useMaterialPropertyStore();
            const warehouseStore = useWarehouseStore();
            const materialOperationReasonStore = useMaterialOperationReasonStore();
            const materialOperationTypeStore = useMaterialOperationTypeStore();
            const userStore = useUserStore();
            const materialStore = useMaterialStore();
            const materialMoveTypeStore = useMaterialMoveTypeStore();
            const contractorStore = useContractorStore();
            const [
                typesCollection,
                unitsCollection,
                brandsCollection,
                propertiesCollection,
                warehousesCollection,
                operationReasonsCollection,
                operationTypesCollection,
                usersCollection,
                materialsCollection,
                moveTypesCollection,
                contractorsCollection
            ] = await Promise.all([
                MaterialType.fetchAll(),
                MaterialUnit.fetchAll(),
                MaterialBrand.fetchAll(),
                MaterialProperty.fetchAll(),
                Warehouse.fetchAll(),
                MaterialOperationReason.fetchAll(),
                MaterialOperationType.fetchAll(),
                User.fetchAll(),
                Material.fetchAll(),
                MaterialMoveType.fetchAll(),
                Contractor.fetchAll(),
            ]);

            materialTypeStore.types = typesCollection;
            materialUnitStore.units = unitsCollection;
            materialBrandStore.brands = brandsCollection;
            materialPropertyStore.properties = propertiesCollection;
            warehouseStore.warehouses = warehousesCollection;
            materialOperationReasonStore.operationReasons = operationReasonsCollection;
            materialOperationTypeStore.operationTypes = operationTypesCollection;
            userStore.users = usersCollection;
            materialStore.materials = materialsCollection;
            materialMoveTypeStore.moveTypes = moveTypesCollection;
            contractorStore.contractors = contractorsCollection;
            

            warehouseStore.selectedWarehouseAtMaterialsPage = warehousesCollection.findById(Number(useLocalStorage<number | null>('selected-warehouse-id', null).value));
        }
    });
}