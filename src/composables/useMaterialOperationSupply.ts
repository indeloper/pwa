import type BaseResourceCollection from "@/models/BaseResourceCollection"
import type MaterialBrand from "@/models/MaterialBrand"
import type MaterialType from "@/models/MaterialType"
 

export function useMaterialOperationSupply() {
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
                children: brands.filter(brand => brand.material_type?.id === type.id)
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
        createMaterialTypesNodes
    }
}


// const items = ref([
//     {
//         label: 'File',
//         icon: 'pi pi-file',
//         items: [
//             {
//                 label: 'New',
//                 icon: 'pi pi-plus',
//                 items: [
//                     {
//                         label: 'Document',
//                         icon: 'pi pi-file'
//                     },
//                     {
//                         label: 'Image',
//                         icon: 'pi pi-image'
//                     },
//                     {
//                         label: 'Video',
//                         icon: 'pi pi-video'
//                     }
//                 ]
//             },
//             {
//                 label: 'Open',
//                 icon: 'pi pi-folder-open'
//             },
//             {
//                 label: 'Print',
//                 icon: 'pi pi-print'
//             }
//         ]
//     },
//     {
//         label: 'Edit',
//         icon: 'pi pi-file-edit',
//         items: [
//             {
//                 label: 'Copy',
//                 icon: 'pi pi-copy'
//             },
//             {
//                 label: 'Delete',
//                 icon: 'pi pi-times'
//             }
//         ]
//     },
//     {
//         label: 'Search',
//         icon: 'pi pi-search'
//     },
//     {
//         separator: true
//     },
//     {
//         label: 'Share',
//         icon: 'pi pi-share-alt',
//         items: [
//             {
//                 label: 'Slack',
//                 icon: 'pi pi-slack'
//             },
//             {
//                 label: 'Whatsapp',
//                 icon: 'pi pi-whatsapp'
//             }
//         ]
//     }
// ]);