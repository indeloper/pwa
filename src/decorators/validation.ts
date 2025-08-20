// Типы валидации
export enum ValidationRuleType {
  REQUIRED = 'required'
}

export interface ValidationRule {
  type: ValidationRuleType;
  message?: string;
  validate: (value: any) => boolean;
}

export interface ValidationError {
  property: string;
  rule: ValidationRuleType;
  message: string;
}

export interface ValidatableModel {
  validationErrors(): ValidationError[];
  isValid(): boolean;
  validate(): boolean;
}

export interface IValidatable {
  validationErrors(): ValidationError[];
  isValid(): boolean;
  validate(): boolean;
}

// Фабрика правил валидации
export class ValidationRules {
  static required(message = 'Поле обязательно для заполнения'): ValidationRule {
    return {
      type: ValidationRuleType.REQUIRED,
      message,
      validate: (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        return true;
      }
    };
  }
}

// Декоратор для свойств - принимает массив правил
export function Validate(rules: ValidationRule[]) {
  return function (target: any, propertyKey: string) {
    // Сохраняем метаданные для валидации (аналогично трансформации)
    if (!target.constructor.validationRulesMap) {
      target.constructor.validationRulesMap = new Map();
    }
    
    target.constructor.validationRulesMap.set(propertyKey, rules);
  };
}

// Декоратор для класса - добавляет функциональность валидации
export function Validatable() {
  return function (target: any) {
    // Переопределяем методы валидации
    target.prototype.validationErrors = function() {
      const validationRulesMap = (this.constructor as any).validationRulesMap;
      if (!validationRulesMap) return [];
      
      const errors: ValidationError[] = [];
      
      for (const [property, rules] of validationRulesMap) {
        for (const rule of rules) {
          const value = (this as any)[property];
          if (!rule.validate(value)) {
            errors.push({
              property,
              rule: rule.type,
              message: rule.message || `Ошибка валидации для поля ${property}`
            });
          }
        }
      }
      
      return errors;
    };

    target.prototype.isValid = function() {
      return this.validationErrors().length === 0;
    };

    target.prototype.validate = function(): boolean {
      return this.isValid();
    };
  };
}
