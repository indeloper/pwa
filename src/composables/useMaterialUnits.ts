import { useMaterialUnitApi, type IMaterialUnitRequest } from "@/api/useMaterialUnitApi";
import type MaterialUnitCollection from "@/models/collections/MaterialUnitCollection";
import MaterialUnit from "@/models/MaterialUnit";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export function useMaterialUnits() {
    const {
        fetchUnits: fetchUnitsApi,
        updateUnit: updateUnitApi,
        storeUnit: storeUnitApi,
        deleteUnit: deleteUnitApi
    } = useMaterialUnitApi();

    const fetch = async (id?: number): Promise<MaterialUnitCollection> => {
        const response = await fetchUnitsApi(id);
        return MaterialUnit.collect(response.map(fromResponse));
    };

    const update = async (unit: MaterialUnit): Promise<MaterialUnit> => {
        const response = await updateUnitApi(toRequest(unit));
        return MaterialUnit.from(Strategy.API_RESPONSE, response);
    };

    const store = async (unit: MaterialUnit): Promise<MaterialUnit> => {
        const response = await storeUnitApi(toRequest(unit));
        return unit.refresh(fromResponse(response));
    };

    const destroy = async (unit: MaterialUnit): Promise<string> => {
        await deleteUnitApi(toRequest(unit));
        return unit.uuid;
    };

    const fromResponse = (response: any): MaterialUnit => {
        return MaterialUnit.from(Strategy.API_RESPONSE, response);
    };

    const toRequest = (unit: MaterialUnit): IMaterialUnitRequest => {
        return unit.to(Strategy.API_REQUEST);
    };

    return { fetch, update, store, destroy };
}
