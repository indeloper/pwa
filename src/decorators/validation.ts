// Типы валидации
export enum ValidationRuleType {
  REQUIRED = 'required',
  UNSIGNED = 'unsigned',
  MIN = 'min',
  MAX = 'max',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length'
}

export interface BaseValidationRule {
  type: ValidationRuleType;
  message?: string;
  validate: (value: any) => boolean;
}

export interface RequiredRule extends BaseValidationRule {
  type: ValidationRuleType.REQUIRED;
}

export interface UnsignedRule extends BaseValidationRule {
  type: ValidationRuleType.UNSIGNED;
}

export interface MinRule extends BaseValidationRule {
  type: ValidationRuleType.MIN;
  min: number;
}

export interface MaxRule extends BaseValidationRule {
  type: ValidationRuleType.MAX;
  max: number;
}

export interface MinLengthRule extends BaseValidationRule {
  type: ValidationRuleType.MIN_LENGTH;
  minLength: number;
}

export interface MaxLengthRule extends BaseValidationRule {
  type: ValidationRuleType.MAX_LENGTH;
  maxLength: number;
}

export type ValidationRule =
  | RequiredRule
  | UnsignedRule
  | MinRule
  | MaxRule
  | MinLengthRule
  | MaxLengthRule;

export interface ValidationError {
  property: string;
  rule: ValidationRuleType;
  message: string;
}

export interface ValidatableModel {
  validationErrors(): ValidationError[];
  isValid(): boolean;
  validate(): boolean;
  isRequired(property: string): boolean;
  isUnsigned(property: string): boolean;
  getMin(property: string): number | undefined;
  getMax(property: string): number | undefined;
  getMinLength(property: string): number | undefined;
  getMaxLength(property: string): number | undefined;
}

export interface IValidatable {
  validationErrors(): ValidationError[];
  isValid(): boolean;
  validate(): boolean;
  isRequired(property: string): boolean;
  isUnsigned(property: string): boolean;
  getMin(property: string): number | undefined;
  getMax(property: string): number | undefined;
  getMinLength(property: string): number | undefined;
  getMaxLength(property: string): number | undefined;
}

// Фабрика правил валидации
export class ValidationRules {
  static required(message = 'Поле обязательно для заполнения'): RequiredRule {
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

  static unsigned(message = 'Значение должно быть неотрицательным'): UnsignedRule {
    return {
      type: ValidationRuleType.UNSIGNED,
      message,
      validate: (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value !== 'number') return true;
        return value >= 0;
      }
    };
  }

  static min(min: number, message?: string): MinRule {
    return {
      type: ValidationRuleType.MIN,
      min,
      message: message || `Значение должно быть ed ${min}`,
      validate: (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value !== 'number') return true;
        return value >= min;
      }
    };
  }

  static max(max: number, message?: string): MaxRule {
    return {
      type: ValidationRuleType.MAX,
      max,
      message: message || `Значение должно быть cd ${max}`,
      validate: (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value !== 'number') return true;
        return value <= max;
      }
    };
  }

  static minLength(minLength: number, message?: string): MinLengthRule {
    return {
      type: ValidationRuleType.MIN_LENGTH,
      minLength,
      message: message || `Длина должна быть ed ${minLength}`,
      validate: (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value !== 'string') return true;
        return value.trim().length >= minLength;
      }
    };
  }

  static maxLength(maxLength: number, message?: string): MaxLengthRule {
    return {
      type: ValidationRuleType.MAX_LENGTH,
      maxLength,
      message: message || `Длина должна быть cd ${maxLength}`,
      validate: (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value !== 'string') return true;
        return value.trim().length <= maxLength;
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

    // Методы для запроса правил по свойству
    target.prototype.isRequired = function(property: string): boolean {
      const map: Map<string, ValidationRule[]> | undefined = (this.constructor as any).validationRulesMap;
      if (!map) return false;
      const rules: ValidationRule[] = map.get(property) || [];
      return rules.some((r) => r.type === ValidationRuleType.REQUIRED);
    };

    target.prototype.isUnsigned = function(property: string): boolean {
      const map: Map<string, ValidationRule[]> | undefined = (this.constructor as any).validationRulesMap;
      if (!map) return false;
      const rules: ValidationRule[] = map.get(property) || [];
      return rules.some((r) => r.type === ValidationRuleType.UNSIGNED);
    };

    target.prototype.getMin = function(property: string): number | undefined {
      const map: Map<string, ValidationRule[]> | undefined = (this.constructor as any).validationRulesMap;
      if (!map) return undefined;
      const rules: ValidationRule[] = map.get(property) || [];
      const rule = rules.find((r) => r.type === ValidationRuleType.MIN) as MinRule | undefined;
      return rule ? rule.min : undefined;
    };

    target.prototype.getMax = function(property: string): number | undefined {
      const map: Map<string, ValidationRule[]> | undefined = (this.constructor as any).validationRulesMap;
      if (!map) return undefined;
      const rules: ValidationRule[] = map.get(property) || [];
      const rule = rules.find((r) => r.type === ValidationRuleType.MAX) as MaxRule | undefined;
      return rule ? rule.max : undefined;
    };

    target.prototype.getMinLength = function(property: string): number | undefined {
      const map: Map<string, ValidationRule[]> | undefined = (this.constructor as any).validationRulesMap;
      if (!map) return undefined;
      const rules: ValidationRule[] = map.get(property) || [];
      const rule = rules.find((r) => r.type === ValidationRuleType.MIN_LENGTH) as MinLengthRule | undefined;
      return rule ? rule.minLength : undefined;
    };

    target.prototype.getMaxLength = function(property: string): number | undefined {
      const map: Map<string, ValidationRule[]> | undefined = (this.constructor as any).validationRulesMap;
      if (!map) return undefined;
      const rules: ValidationRule[] = map.get(property) || [];
      const rule = rules.find((r) => r.type === ValidationRuleType.MAX_LENGTH) as MaxLengthRule | undefined;
      return rule ? rule.maxLength : undefined;
    };
  };
}
