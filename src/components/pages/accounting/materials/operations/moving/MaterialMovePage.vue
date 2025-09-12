<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MaterialMoveType from '@/models/MaterialMoveType';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import MaterialCollection from '@/models/collections/MaterialCollection';
import FullScreenWrapper from '@/components/ui/FullScreenWrapper.vue';
import Warehouse from '@/models/Warehouse';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
import MaterialOperation from '@/models/MaterialOperation';
import { DEAFULT_NEXT_BUTTON_PROPS, DEAFULT_BACK_BUTTON_PROPS, DEAFULT_CONFIRM_BUTTON_PROPS } from '@/constants';
import MaterialMoveMaterialsSelection from './partials/MaterialMoveMaterialsSelection.vue';
import MaterialMoveOperationParamsForm from './partials/MaterialMoveOperationParamsForm.vue';
import { useToastMessage } from '@/composables/useToastMessage';

const route = useRoute();
const { addWarnMessage } = useToastMessage();


const materialMoveTypeStore = MaterialMoveType.resourceStore;
const warehouseStore = Warehouse.resourceStore;
/** @ts-ignore */
const { moveTypes } = storeToRefs(materialMoveTypeStore);
/** @ts-ignore */
const { selectedWarehouseAtMaterialsPage } = storeToRefs(warehouseStore);

const materialsCollection = ref<MaterialCollection>(new MaterialCollection([]));
const materialOperation = ref<MaterialOperation>(MaterialOperation.createEmpty());
const currentStep = ref(1);


const moveType = computed(() => route.params.type ? moveTypes.value.findById(Number(route.params.type)) : null);

const materialOperationParamsFormRef = ref<InstanceType<typeof MaterialMoveOperationParamsForm> | null>(null);


const prevStep = () => {
    currentStep.value--;
};

const nextStep = async () => {

    if (currentStep.value === 1) {
        if (materialsCollection.value.isEmpty() || (materialsCollection.value as any).hasEmptyValuesMaterials()) {
            addWarnMessage('Материал не выбран или есть пустые значения');
            return;
        }
    }
    if (currentStep.value === 2) {
        const ok = await materialOperationParamsFormRef.value?.submit?.();
        if (!ok) {
            return;
        }
    }

    currentStep.value++;
};

const handleSubmitOperation = () => {
    console.log('handleSubmitOperation');
};

</script>

<template>
    <template v-if="selectedWarehouseAtMaterialsPage">
        <FullScreenWrapper :title="moveType?.description">
            <div class="h-full">
                <Stepper class="min-h-[60vh]" :value="currentStep" linear>
                    <StepList class="bg-gray-100 rounded-md">
                        <Step :value="1">Выбор материала</Step>
                        <Step :value="2">Указание параметров</Step>
                        <Step :value="3">Подтверждение</Step>
                    </StepList>
                    <StepPanels>
                        <StepPanel :value="1">
                            <MaterialMoveMaterialsSelection :moveType="moveType"
                                v-model:materialsCollection="materialsCollection" />
                        </StepPanel>
                        <StepPanel :value="2">
                            <MaterialMoveOperationParamsForm ref="materialOperationParamsFormRef"
                                :materialOperation="materialOperation" />
                        </StepPanel>
                        <StepPanel :value="3">
                            <div class="flex flex-col min-h-[75vh]">
                                <div
                                    class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                                    Content III</div>
                            </div>
                        </StepPanel>
                    </StepPanels>
                </Stepper>
                <div class="flex justify-between items-center">
                    <div>
                        <Button v-if="currentStep !== 1" v-bind="DEAFULT_BACK_BUTTON_PROPS" @click="prevStep" />
                    </div>
                    <div>
                        <Button v-if="currentStep !== 3" v-bind="DEAFULT_NEXT_BUTTON_PROPS" @click="nextStep" />
                        <Button v-if="currentStep === 3" v-bind="DEAFULT_CONFIRM_BUTTON_PROPS"
                            @click="handleSubmitOperation" />
                    </div>

                </div>
            </div>

        </FullScreenWrapper>
    </template>
    <template v-else>
        <div class="flex justify-center items-center h-full">
            <p class="text-lg font-bold">Склад не выбран</p>
        </div>
    </template>
</template>