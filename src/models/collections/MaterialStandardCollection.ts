import BaseCollection from "../BaseCollection";
import MaterialStandard from "../MaterialStandard";

export default class MaterialStandardCollection extends BaseCollection<MaterialStandard> {
    constructor(items: MaterialStandard[] = []) {
        super(items);
    }

    findById(id: number): MaterialStandard | undefined {
        return this.find(item => item.id === id);
    }

    findByName(name: string): MaterialStandard | undefined {
        return this.find(item => item.name === name);
    }

    findByTypeId(typeId: number): MaterialStandard[] {
        return this.filter(item => item.material_type?.id === typeId);
    }

    findByBrandId(brandId: number): MaterialStandard[] {
        return this.filter(item => item.material_brand?.id === brandId);
    }

    findByOldStandardId(oldStandardId: number): MaterialStandard[] {
        return this.filter(item => item.old_standard_id === oldStandardId);
    }

    getNames(): string[] {
        return this.map(item => item.name);
    }

    getTypeIds(): number[] {
        return this.filter(item => item.material_type)
            .map(item => item.material_type!.id)
            .filter((id, index, arr) => arr.indexOf(id) === index);
    }

    getBrandIds(): number[] {
        return this.filter(item => item.material_brand)
            .map(item => item.material_brand!.id)
            .filter((id, index, arr) => arr.indexOf(id) === index);
    }

    withDescription(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => item.hasDescription));
    }

    withoutDescription(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => !item.hasDescription));
    }

    withType(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => item.hasType));
    }

    withoutType(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => !item.hasType));
    }

    withBrand(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => item.hasBrand));
    }

    withoutBrand(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => !item.hasBrand));
    }

    withProperties(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => item.hasProperties));
    }

    withoutProperties(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => !item.hasProperties));
    }

    withAlternatives(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => item.hasAlternatives));
    }

    withoutAlternatives(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => !item.hasAlternatives));
    }

    oldStandards(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => item.isOldStandard));
    }

    newStandards(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.filter(item => !item.isOldStandard));
    }

    sortedByName(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.sort((a, b) => a.name.localeCompare(b.name)));
    }

    sortedByTypeName(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.sort((a, b) => 
            (a.typeName || '').localeCompare(b.typeName || '')
        ));
    }

    sortedByBrandName(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.sort((a, b) => 
            (a.brandName || '').localeCompare(b.brandName || '')
        ));
    }

    sortedByPropertiesCount(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.sort((a, b) => a.propertiesCount - b.propertiesCount));
    }

    sortedByBrandsCount(): MaterialStandardCollection {
        return new MaterialStandardCollection(this.sort((a, b) => a.brandsCount - b.brandsCount));
    }

    getAveragePropertiesCount(): number {
        if (this.isEmpty()) return 0;
        const counts = this.map(item => item.propertiesCount);
        const sum = counts.reduce((acc, count) => acc + count, 0);
        return sum / counts.length;
    }

    getMaxPropertiesCount(): number {
        if (this.isEmpty()) return 0;
        return Math.max(...this.map(item => item.propertiesCount));
    }

    getMinPropertiesCount(): number {
        if (this.isEmpty()) return 0;
        return Math.min(...this.map(item => item.propertiesCount));
    }
}
