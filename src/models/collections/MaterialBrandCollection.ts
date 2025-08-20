import BaseCollection from "../BaseCollection";
import MaterialBrand from "../MaterialBrand";

export default class MaterialBrandCollection extends BaseCollection<MaterialBrand> {
    constructor(items: MaterialBrand[] = []) {
        super(items);
    }

    findById(id: number): MaterialBrand | undefined {
        return this.find(item => item.id === id);
    }

    findByName(name: string): MaterialBrand | undefined {
        return this.find(item => item.name === name);
    }

    findByTypeId(typeId: number): MaterialBrand[] {
        return this.filter(item => item.material_type?.id === typeId);
    }

    getNames(): string[] {
        return this.map(item => item.name);
    }

    getTypeIds(): number[] {
        return this.filter(item => item.material_type)
            .map(item => item.material_type!.id)
            .filter((id, index, arr) => arr.indexOf(id) === index);
    }

    withDescription(): MaterialBrandCollection {
        return new MaterialBrandCollection(this.filter(item => item.hasDescription));
    }

    withoutDescription(): MaterialBrandCollection {
        return new MaterialBrandCollection(this.filter(item => !item.hasDescription));
    }

    withType(): MaterialBrandCollection {
        return new MaterialBrandCollection(this.filter(item => item.hasType));
    }

    withoutType(): MaterialBrandCollection {
        return new MaterialBrandCollection(this.filter(item => !item.hasType));
    }

    sortedByName(): MaterialBrandCollection {
        return new MaterialBrandCollection(this.sort((a, b) => a.name.localeCompare(b.name)));
    }

    sortedByWeight(): MaterialBrandCollection {
        return new MaterialBrandCollection(this.sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight)));
    }

    getAverageWeight(): number {
        if (this.isEmpty()) return 0;
        const weights = this.map(item => parseFloat(item.weight));
        const sum = weights.reduce((acc, weight) => acc + weight, 0);
        return sum / weights.length;
    }

    getMaxWeight(): number {
        if (this.isEmpty()) return 0;
        return Math.max(...this.map(item => parseFloat(item.weight)));
    }

    getMinWeight(): number {
        if (this.isEmpty()) return 0;
        return Math.min(...this.map(item => parseFloat(item.weight)));
    }
}
