import BaseCollection from "../BaseCollection";
import type MaterialUnit from "../MaterialUnit";

export default class MaterialUnitCollection extends BaseCollection<MaterialUnit> {
    constructor(items: MaterialUnit[] = []) {
        super(items);
    }

    /**
     * Найти единицу измерения по ID
     */
    findById(id: number): MaterialUnit | undefined {
        return this.find(item => item.id === id);
    }

    /**
     * Найти единицу измерения по метке (label)
     */
    findByLabel(label: string): MaterialUnit | undefined {
        return this.find(item => item.label === label);
    }

    /**
     * Найти единицу измерения по названию
     */
    findByName(name: string): MaterialUnit | undefined {
        return this.find(item => item.name === name);
    }

    /**
     * Получить все метки единиц измерения
     */
    getLabels(): string[] {
        return this.map(item => item.label).toArray();
    }

    /**
     * Получить все названия единиц измерения
     */
    getNames(): string[] {
        return this.map(item => item.name).toArray();
    }

    /**
     * Фильтровать по описанию (исключить null значения)
     */
    withDescription(): MaterialUnitCollection {
        return new MaterialUnitCollection(
            this.filter(item => item.description !== null).toArray()
        );
    }
}
