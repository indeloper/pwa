import MaterialUnit from "@/models/MaterialUnit";
import BaseApi from "./BaseApi";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export default class MaterialUnitApi extends BaseApi<MaterialUnit> {
    async fetchAll(): Promise<any[]> {
        const path = 'https://erp.sk-gorod.com/api/v3/library/materials/units';
        const { data } = await this.getEtagCached<any>(path);
        return data ? this.extractPayload<any[]>(data) : [];
    }

    async fetchOne(id: number): Promise<MaterialUnit> {
        const path = `https://erp.sk-gorod.com/api/v3/library/materials/units/${id}`;
        const body = await this.getJson<{ data: any; message?: string }>(path);
        return MaterialUnit.from(Strategy.API_RESPONSE, this.extractPayload(body));
    }

    async update(model: MaterialUnit): Promise<MaterialUnit> {
        const path = `https://erp.sk-gorod.com/api/v3/library/materials/units/${model.id}`;
        const body = await this.putJson<{ data: any, message: string }>(path, model);
        return MaterialUnit.from(Strategy.API_RESPONSE, body.data);
    }

    async store(model: MaterialUnit): Promise<MaterialUnit> {
        const path = 'https://erp.sk-gorod.com/api/v3/library/materials/units';
        const body = await this.postJson<{ data: any; message: string }>(path, model);
        return MaterialUnit.from(Strategy.API_RESPONSE, body.data);
    }

    async destroy(model: MaterialUnit): Promise<void> {
        const path = `https://erp.sk-gorod.com/api/v3/library/materials/units/${model.id}`;
        await this.deleteJson(path);
    }
}