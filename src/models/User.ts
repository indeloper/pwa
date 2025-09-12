import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import { useUserStore } from "@/stores/useUserStore";

export interface IUser {
    id?: number;
    user_full_name: string;
    email: string;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/users',
    key: 'id',
    store: () => useUserStore()
})
export default class User extends BaseResource implements IUser {

    @MapField()
    id?: number;

    @MapField()
    @Field({
        label: 'ФИО',
        type: 'text',
        placeholder: 'Укажите ФИО',
        required: true,
    })
    user_full_name: string = '';

    @MapField()
    @Field({
        label: 'Email',
        type: 'text',
        placeholder: 'Укажите Email',
        required: true,
    })
    email: string = '';
}