/**
 * Стратегии трансформации для моделей
 */
export enum ModelsTransformStrategies {
    // Базовые стратегии для API
    API_RESPONSE = 'api_response',
    API_REQUEST = 'api_request',
    
    // Дополнительные стратегии для форм
    FORM = 'form',
    
    // Стратегии для UI
    UI = 'ui',
    
    // Стратегии для экспорта
    EXPORT = 'export',
    
    // Стратегии для кэша
    CACHE = 'cache',
    
    // Стратегии для стандартов материалов
    MATERIAL_STANDARD = 'material_standard',
    
    // Стратегии для других материалов
    MATERIAL = 'material',
    
    // Новая стратегия для создания материала из стандарта
    MATERIAL_FROM_STANDARD = 'material_from_standard'
}
