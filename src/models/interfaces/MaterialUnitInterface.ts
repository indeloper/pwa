import type { IModel, ITransformable } from "@/decorators";
import type { ValidationError } from "@/decorators/validation";

export interface MaterialUnitInterface extends IModel, ITransformable {
    id?: number;
    name: string;
    label: string;
    description: string | null;
    validationErrors(): ValidationError[];
    isValid(): boolean;
    validate(): boolean;
}
