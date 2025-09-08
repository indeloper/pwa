import MaterialTypeApi from "@/api/MaterialTypeApi";
import type MaterialTypeCollection from "@/models/collections/MaterialTypeCollection";
import MaterialType from "@/models/MaterialType";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export default class MaterialTypeService {    
    static async fetchAll(): Promise<MaterialTypeCollection> {
        const api = new MaterialTypeApi();
        const response = await api.fetchAll();
        return MaterialType.collect(response.map(MaterialTypeService.fromResponse));
    }

    static fromResponse(response: any): MaterialType {
        return MaterialType.from(Strategy.API_RESPONSE, response);
    }
}