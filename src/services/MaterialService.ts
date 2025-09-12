import Material from "@/models/Material";
import BaseResourceService from "./BaseResourceService";

export default class MaterialService extends BaseResourceService {

    static createMaterialByParams(params: { material_type_id: number, material_brand_id: number, material_property_id: number | null }): Material {
        const material = new Material();
        material.material_type_id = params.material_type_id;
        material.material_brand_id = params.material_brand_id;
        material.material_property_id = params.material_property_id ?? null;
        return material;
    }

    static test() {
        alert('test');
    }
    
}