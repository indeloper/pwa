<script setup lang="ts">
import BaseResourceForm from '@/components/forms/BaseResourceForm.vue';
import MaterialOperation from '@/models/MaterialOperation';
import { ref, computed } from 'vue';

const props = defineProps<{
    materialOperation: MaterialOperation;
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'submit'): void;
    (e: 'cancel'): void;
}>();

const materialOperation = ref<MaterialOperation>(props.materialOperation);
const loading = ref(props.loading);
const baseResourceFormRef = ref<InstanceType<typeof BaseResourceForm> | null>(null);

const handleSubmitParamsForm = async (): Promise<boolean> => {
    const ok = await baseResourceFormRef.value?.submit?.();
    if (ok) {
       emit('submit');
    }
    return ok ?? false;
};

const isValidForm = computed(() => baseResourceFormRef.value?.isValidForm ?? false);

defineExpose({
    submit: handleSubmitParamsForm,
    isValidForm,
});

</script>

<template>
    <div class="min-h-[75vh] flex flex-col gap-4 pt-4">
        <p class="text-lg font-bold">Параметры операции</p>
        <BaseResourceForm ref="baseResourceFormRef" hide-buttons :model="materialOperation" v-model:loading="loading"
            :columns="3" />
    </div>
</template>