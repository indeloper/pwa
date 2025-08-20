import BaseCollection from "../BaseCollection";
import MaterialProperty from "../MaterialProperty";

export default class MaterialPropertyCollection extends BaseCollection<MaterialProperty> {
    constructor(items: MaterialProperty[] = []) {
        super(items);
    }

    /**
     * Найти свойство материала по ID
     */
    findById(id: number): MaterialProperty | undefined {
        return this.find(item => item.id === id);
    }

    /**
     * Найти свойство материала по названию
     */
    findByName(name: string): MaterialProperty | undefined {
        return this.find(item => item.name === name);
    }

    /**
     * Получить все названия свойств материалов
     */
    getNames(): string[] {
        return this.map(item => item.name).toArray();
    }

    /**
     * Фильтровать свойства с описанием
     */
    withDescription(): MaterialPropertyCollection {
        return new MaterialPropertyCollection(
            this.filter(item => item.description !== null).toArray()
        );
    }

    /**
     * Фильтровать свойства без описания
     */
    withoutDescription(): MaterialPropertyCollection {
        return new MaterialPropertyCollection(
            this.filter(item => item.description === null).toArray()
        );
    }

    /**
     * Фильтровать свойства по весовому коэффициенту
     */
    withWeightFactorGreaterThan(factor: number): MaterialPropertyCollection {
        return new MaterialPropertyCollection(
            this.filter(item => item.weight_factor > factor).toArray()
        );
    }

    /**
     * Фильтровать свойства по весовому коэффициенту
     */
    withWeightFactorLessThan(factor: number): MaterialPropertyCollection {
        return new MaterialPropertyCollection(
            this.filter(item => item.weight_factor < factor).toArray()
        );
    }

    /**
     * Получить свойства, отсортированные по весовому коэффициенту
     */
    sortedByWeightFactor(): MaterialPropertyCollection {
        return new MaterialPropertyCollection(
            this.sort((a, b) => a.weight_factor - b.weight_factor).toArray()
        );
    }

    /**
     * Получить свойства, отсортированные по названию
     */
    sortedByName(): MaterialPropertyCollection {
        return new MaterialPropertyCollection(
            this.sort((a, b) => a.name.localeCompare(b.name)).toArray()
        );
    }

    /**
     * Получить средний весовой коэффициент
     */
    getAverageWeightFactor(): number {
        if (this.isEmpty()) return 0;
        const total = this.reduce((sum, item) => sum + item.weight_factor, 0);
        return total / this.count();
    }

    /**
     * Получить максимальный весовой коэффициент
     */
    getMaxWeightFactor(): number {
        if (this.isEmpty()) return 0;
        return Math.max(...this.map(item => item.weight_factor).toArray());
    }

    /**
     * Получить минимальный весовой коэффициент
     */
    getMinWeightFactor(): number {
        if (this.isEmpty()) return 0;
        return Math.min(...this.map(item => item.weight_factor).toArray());
    }
}
