import type MaterialType from "@/models/MaterialType";
import BaseApi from "./BaseApi";

export default class MaterialTypeApi extends BaseApi<MaterialType> {
    async fetchAll(): Promise<any[]> {
        const path = 'https://erp.sk-gorod.com/api/v3/library/materials/material-types';
        const { data } = await this.getEtagCached<any>(path);
        return data ? this.extractPayload<any[]>(data) : [];
    }
}