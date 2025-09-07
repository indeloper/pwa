import type BaseCollection from "@/models/BaseCollection";
import BaseApi from "./BaseApi";
import MaterialStandard from "@/models/MaterialStandard";

export default class MaterialStandardApi extends BaseApi<MaterialStandard> {
    async fetchAll(id?: number): Promise<BaseCollection<MaterialStandard>> {
        return await this.api.get(`/standards`, { params: { id } });
    }

}