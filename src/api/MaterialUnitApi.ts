import MaterialUnit from "@/models/MaterialUnit";
import BaseApi from "./BaseApi";
import { ModelsTransformStrategies as Strategy } from "@/enums";
import type MaterialUnitCollection from "@/models/collections/MaterialUnitCollection";

export default class MaterialUnitApi extends BaseApi<MaterialUnit> {

    async fetchAll(id?: number): Promise<MaterialUnitCollection> {
        const response = await this.api.get(import.meta.env.VITE_API_BASE_URL + '/library/materials/units' + (id ? '/' + id : ''));
        return MaterialUnit.collect(response.data.map(this.fromResponse));
    }
    
    async fetchOne(id: number): Promise<MaterialUnit> {
        const response = await this.api.get(import.meta.env.VITE_API_BASE_URL + '/library/materials/units/' + id);
        return MaterialUnit.from(Strategy.API_RESPONSE, response);
    }

    async update(model: MaterialUnit): Promise<MaterialUnit> {
        const response = await this.api.put(import.meta.env.VITE_API_BASE_URL + '/library/materials/units/' + model.id, model);
        console.log(response, 'api ');
        console.log(MaterialUnit.from(Strategy.API_RESPONSE, response.data), 'api response');
        
        
        return MaterialUnit.from(Strategy.API_RESPONSE, response.data);
    }

    private fromResponse(response: any): MaterialUnit {
        return MaterialUnit.from(Strategy.API_RESPONSE, response);
    }
}