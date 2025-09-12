import BaseResourceCollection from "@/models/BaseResourceCollection";
import Material from "../Material";
import type { IBaseCollection } from "../BaseCollection";

export interface IMaterialCollection extends IBaseCollection<Material> {
    hasEmptyValuesMaterials(): boolean;
}

export default class MaterialCollection extends BaseResourceCollection<Material> implements IMaterialCollection {
    hasEmptyValuesMaterials(): boolean {
        return this.filter((item: Material) => item.isEmptyValues).count() > 0;
    }
}