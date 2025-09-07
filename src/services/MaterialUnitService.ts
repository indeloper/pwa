import MaterialUnitApi from "@/api/MaterialUnitApi";
import MaterialUnit from "@/models/MaterialUnit";
import { ModelsTransformStrategies as Strategy } from "@/enums";
// BackgroundTaskManager не требуется напрямую здесь
import { enqueueRefreshMaterialUnitsTask } from "@/workers/tasks/refreshMaterialUnits";

export default class MaterialUnitService {
    static async fetchAll() {
        const api = new MaterialUnitApi();
        const response = await api.fetchAll();
        return MaterialUnit.collect(response.map(MaterialUnitService.fromResponse));
    }

    static async update(unit: MaterialUnit) {
        const api = new MaterialUnitApi();
        const updated = await api.update(unit.to(Strategy.API_REQUEST));
        enqueueRefreshMaterialUnitsTask();
        return updated;
    }

    static async store(unit: MaterialUnit): Promise<MaterialUnit> {
        const api = new MaterialUnitApi();
        const created = await api.store(unit.to(Strategy.API_REQUEST));
        enqueueRefreshMaterialUnitsTask();
        return created;
    }

    static async destroy(unit: MaterialUnit) {
        const api = new MaterialUnitApi();
        await api.destroy(unit.to(Strategy.API_REQUEST));
        enqueueRefreshMaterialUnitsTask();
    }

    static fromResponse(response: any): MaterialUnit {
        return MaterialUnit.from(Strategy.API_RESPONSE, response);
    }
}