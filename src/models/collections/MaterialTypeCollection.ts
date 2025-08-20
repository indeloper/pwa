import BaseCollection from "../BaseCollection";
import MaterialType from "../MaterialType";

export default class MaterialTypeCollection extends BaseCollection<MaterialType> {
    constructor(items: MaterialType[] = []) {
        super(items);
    }

    /**
     * Найти тип материала по ID
     */
    findById(id: number): MaterialType | undefined {
        return this.find(item => item.id === id);
    }

    /**
     * Найти тип материала по названию
     */
    findByName(name: string): MaterialType | undefined {
        return this.find(item => item.name === name);
    }

    /**
     * Найти типы материалов по ID единицы измерения
     */
    findByUnitId(unitId: number): MaterialTypeCollection {
        return new MaterialTypeCollection(
            this.filter(item => item.unit_id === unitId).toArray()
        );
    }

    /**
     * Получить все названия типов материалов
     */
    getNames(): string[] {
        return this.map(item => item.name).toArray();
    }

    /**
     * Получить все ID единиц измерения
     */
    getUnitIds(): number[] {
        return this.map(item => item.unit_id).toArray();
    }

    /**
     * Фильтровать типы с фиксированным количеством
     */
    withFixedQuantity(): MaterialTypeCollection {
        return new MaterialTypeCollection(
            this.filter(item => item.fixed_quantity).toArray()
        );
    }

    /**
     * Фильтровать типы с описанием
     */
    withDescription(): MaterialTypeCollection {
        return new MaterialTypeCollection(
            this.filter(item => item.description !== null).toArray()
        );
    }

    /**
     * Фильтровать типы с инструкциями
     */
    withInstructions(): MaterialTypeCollection {
        return new MaterialTypeCollection(
            this.filter(item => item.instruction !== null).toArray()
        );
    }

    /**
     * Фильтровать типы с свойствами
     */
    withProperties(): MaterialTypeCollection {
        return new MaterialTypeCollection(
            this.filter(item => item.hasProperties).toArray()
        );
    }

    /**
     * Получить типы, отсортированные по названию
     */
    sortedByName(): MaterialTypeCollection {
        return new MaterialTypeCollection(
            this.sort((a, b) => a.name.localeCompare(b.name)).toArray()
        );
    }
}
