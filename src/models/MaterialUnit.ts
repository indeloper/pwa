import { Model, Transformable, From, To, Validatable, Validate, ValidationRules, type IModel, type ITransformable, type IValidatable } from "@/decorators";
import MaterialUnitCollection from "./collections/MaterialUnitCollection";
import { ModelsTransformStrategies as Strategy } from "@/enums";
import MaterialUnitApi from "@/api/MaterialUnitApi";

import type { ValidationError } from "@/decorators/validation";
import BaseModel from "./BaseModel";

export interface IMaterialUnit extends IModel<IMaterialUnit>, ITransformable<IMaterialUnit>, IValidatable {
    id?: number;
    label: string;
    name: string;
    description: string | null;
    display_name: string;
}

@Model()
@Transformable()
@Validatable()
class MaterialUnit extends BaseModel<IMaterialUnit> implements IMaterialUnit {
    @From(Strategy.API_RESPONSE, 'id')
    @To(Strategy.API_REQUEST, 'id')
    id?: number;

    @From(Strategy.API_RESPONSE, 'attributes.label')
    @To(Strategy.API_REQUEST, 'label')
    @Validate([ValidationRules.required('Короткое наименование обязательно для заполнения')])
    label: string = '';

    @From(Strategy.API_RESPONSE, 'attributes.name')
    @To(Strategy.API_REQUEST, 'name')
    @Validate([ValidationRules.required('Наименование обязательно для заполнения')])
    name: string = '';

    @From(Strategy.API_RESPONSE, 'attributes.description')
    @To(Strategy.API_REQUEST, 'description')
    description: string | null = null;

    static collection = MaterialUnitCollection;
    static api = new MaterialUnitApi();

    get display_name(): string {
        return `${this.name} (${this.label})`;
    }

    static async fetch(id?: number): Promise<MaterialUnitCollection> {
        return await this.api.fetchAll(id);
    }

    async update(): Promise<IMaterialUnit> {
        return await MaterialUnit.api.update(this);
    }

    async store(): Promise<IMaterialUnit> {
        // Метод store пока не реализован в API
        throw new Error('Method store not implemented yet');
    }

    async destroy(): Promise<string> {
        // Метод destroy пока не реализован в API
        throw new Error('Method destroy not implemented yet');
    }
}

declare namespace MaterialUnit {
    function collect(items: IMaterialUnit[]): MaterialUnitCollection;
    function createEmpty(): MaterialUnit;
    function clone(model: MaterialUnit): MaterialUnit;
    function from(strategy: string | symbol, data: any): MaterialUnit;
    function to(strategy: string | symbol): any;
    function validationErrors(): ValidationError[];
    function isValid(): boolean;
    function validate(): boolean;
}

export default MaterialUnit;
// export default MaterialUnit as typeof MaterialUnit & IModelStatic<IMaterialUnit> & ITransformable<IMaterialUnit> & IValidatable;
