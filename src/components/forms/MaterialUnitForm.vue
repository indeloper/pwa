<script setup lang="ts">
import type MaterialUnit from '@/models/MaterialUnit';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import ValidatableModelForm from './ValidatableModelForm.vue';
import ValidatableModelField from './ValidatableModelField.vue';

const emit = defineEmits<{
    (e: 'submit', model: MaterialUnit): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<MaterialUnit>('model', { required: true });
const loading = defineModel<boolean>('loading', { required: true });

const handleSubmit = (model: MaterialUnit) => {
    emit('submit', model);
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <ValidatableModelForm v-model:model="model" :loading="loading" @submit="handleSubmit" @cancel="handleCancel">
        <template #default="{ model, errors, touched }">
            <div class="flex flex-col gap-4">
                <ValidatableModelField :model="model" label="Наименование" property="name" :touched="touched">
                    <InputText v-model="model!.name" placeholder="Укажите полное наименование" fluid
                        :disabled="loading" />
                </ValidatableModelField>
                <ValidatableModelField :model="model" label="Короткое наименование" property="label" :touched="touched">
                    <InputText v-model="model!.label" placeholder="Укажите короткое наименование" fluid
                        :disabled="loading" />
                </ValidatableModelField>
                <ValidatableModelField :model="model" label="Описание" property="description" :touched="touched">
                    <Textarea v-model="model!.description" placeholder="Укажите описание" fluid :disabled="loading" />
                </ValidatableModelField>
                <ValidatableModelField :model="model" label="Коэффициент" property="coefficient" :touched="touched">
                    <InputNumber v-model="model!.coefficient" :max-fraction-digits="3" placeholder="Укажите коэффициент"
                        fluid :disabled="loading" />
                </ValidatableModelField>
            </div>
        </template>
    </ValidatableModelForm>
</template>