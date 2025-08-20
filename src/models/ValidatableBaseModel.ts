import BaseModel from "./BaseModel";
import type { ValidationError } from "@/decorators/validation";

export class ValidatableBaseModel extends BaseModel {
  // Эти методы будут переопределены декоратором @Validatable
  validationErrors(): ValidationError[] {
    return [];
  }
  
  isValid(): boolean {
    return true;
  }
  
  validate(): boolean {
    return this.isValid();
  }
}
