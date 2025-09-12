import type BaseResourceCollection from "@/models/BaseResourceCollection"
import type MaterialType from "@/models/MaterialType"
import type MaterialBrand from "@/models/MaterialBrand"


export function useMaterial() {
    const createMaterialTypesNodes = (
        types: BaseResourceCollection<any>,
        brands: BaseResourceCollection<any>
    ) => {

        return types.toArray().map((type: MaterialType) => {
            return {
                key: type.id,
                label: type.name,
                data: {
                    name: type.name,
                    material_type_id: type.id,
                },
                icon: 'pi pi-file',
                children: brands
                    .filter(brand => brand.material_type?.id === type.id)
                    .toArray()
                    .map((brand: MaterialBrand) => {
                        return {
                            key: type.id + '-' + brand.id,
                            label: brand.name,
                            data: {
                                name: brand.name,
                                material_type_id: type.id,
                                material_brand_id: brand.id,
                                material_property_id: null,
                            },
                            icon: 'pi pi-file',
                        }
                    })
            }
        })
    }

    return {
        createMaterialTypesNodes,
    }
}