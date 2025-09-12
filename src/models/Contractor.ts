import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import { useContractorStore } from "@/stores/useContractorStore";

export interface IContractor {
    id?: number;
    short_name: string;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/contractors',
    key: 'id',
    store: () => useContractorStore()
})
export default class Contractor extends BaseResource implements IContractor {

    @MapField()
    id?: number;

    @MapField()
    @Field({
        label: 'Наименование',
        type: 'text',
        placeholder: 'Укажите наименование',
        required: true,
    })
    short_name: string = '';
}

