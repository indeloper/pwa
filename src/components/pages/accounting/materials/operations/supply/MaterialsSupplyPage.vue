<script setup lang="ts">
import MaterialOperationReason from '@/models/MaterialOperationReason';
import MaterialBrand from '@/models/MaterialBrand';
import MaterialType from '@/models/MaterialType';
import { storeToRefs } from 'pinia';
import Select from 'primevue/select';
import { computed, ref } from 'vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanel from 'primevue/steppanel';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import { useMaterialOperationSupply } from '@/composables/useMaterialOperationSupply';
import TieredMenu from 'primevue/tieredmenu';
import Column from 'primevue/column';
import TreeTable from 'primevue/treetable';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import MaterialService from '@/services/MaterialService';
import Material from '@/models/Material';
import { ModelsTransformStrategies as Strategy } from '@/enums';
import BaseResourceTable from '@/components/tables/BaseResourceTable.vue';
import BaseResourceCollection from '@/models/BaseResourceCollection';
import MaterialCollection from '@/models/collections/MaterialCollection';
import { useThrottledRefHistory } from '@vueuse/core'
import { shallowRef } from 'vue'
// import MaterialOperation from '@/models/MaterialOperation';

const materialOperationReasonStore = MaterialOperationReason.resourceStore;
const materialTypeStore = MaterialType.resourceStore;
const materialBrandStore = MaterialBrand.resourceStore;
// const materialOperationStore = MaterialOperation.resourceStore;
/** @ts-ignore */
const { operationReasons } = storeToRefs(materialOperationReasonStore);
/** @ts-ignore */
const { types } = storeToRefs(materialTypeStore);
/** @ts-ignore */
const { brands } = storeToRefs(materialBrandStore);
/** @ts-ignore */
// const { operations } = storeToRefs(materialOperationStore);
const menu = ref<typeof TieredMenu>(null);
const filters = ref({});


const { createMaterialTypesNodes } = useMaterialOperationSupply();

const materialTypesNodes = computed(() => {
    return createMaterialTypesNodes(types.value, brands.value);
});


const supplyReasons = computed(() => {
    return operationReasons.value
        .filter((reason: MaterialOperationReason) => reason.is_supply)
        .toOptions();
});





const operationReason = ref<MaterialOperationReason>(MaterialOperationReason.createEmpty());

const toggleTieredMenu = (event: Event) => {
    menu.value.toggle(event);
}

const handleNodeSelect = (data: any) => {
    const material = MaterialService.createMaterialByParams({
        material_type_id: data.material_type_id,
        material_brand_id: data.material_brand_id,
        material_property_id: data.material_property_id,
    });
    materialsCollection.value.push(material);

}

const materials = ref<Material[]>([]);
const materialsCollection = ref<MaterialCollection>(new MaterialCollection([]));

const handleDeleteMaterial = (material: Material) => {
    materialsCollection.value.removeByUuid(material.uuid);
};

const handleUpdateField = (material: Material, fieldName: string, newValue: any) => {
    console.log(material, fieldName, newValue);
};

</script>

<template>
    <p class="text-2xl font-bold">Поставка материала</p>
    <Stepper value="1" linear>
        <StepList>
            <Step value="1">Выбор материала</Step>
            <Step value="2">Указание параметров</Step>
            <Step value="3">Подтверждение</Step>
        </StepList>
        <StepPanels>
            <StepPanel v-slot="{ activateCallback }" value="1">
                <div class="grid grid-cols-4 gap-6">
                    
                    <div class="col-span-3">
                        <template v-if="materialsCollection.isNotEmpty()">
                            <BaseResourceTable :models="materialsCollection"
                                :only="['material_type_id', 'material_brand_id', 'material_property_id', 'value', 'amount', 'comment']"
                                :start-delete="handleDeleteMaterial" show-editing
                                @on-update-field="handleUpdateField" />
                        </template>
                        <template v-else>
                            <p class="text-gray-500 text-center">Материалы не выбраны</p>
                        </template>

                    </div>

                </div>
                <div class="flex pt-6 justify-end">
                    <Button label="Далее"
                        :disabled="materialsCollection.hasEmptyValuesMaterials() || materialsCollection.isEmpty()"
                        icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('2')" />
                </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" value="2">
                <div class="p-4 rounded-md bg-gray-100">
                    <Select :options="supplyReasons" optionLabel="label" optionValue="value" />
                </div>
                <div class="flex pt-6 justify-between">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                    <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" />
                </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" value="3">
                <div class="flex flex-col h-48">
                    <div
                        class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                        Content III</div>
                </div>
                <div class="pt-6">
                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                </div>
            </StepPanel>
        </StepPanels>
    </Stepper>



    <!-- <pre>{{ operationReason }}</pre> -->
</template>