<script setup lang="ts">
import type MaterialUnit from '@/models/MaterialUnit';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import ValidatableModelForm from './ValidatableModelForm.vue';
import ValidationMessage from '../ui/ValidationMessage.vue';

const emit = defineEmits<{
    (e: 'submit', model: MaterialUnit): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<MaterialUnit>('model', { required: true });

const handleSubmit = (model: MaterialUnit) => {
    emit('submit', model);
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <ValidatableModelForm 
        v-model:model="model" 
        @submit="handleSubmit" 
        @cancel="handleCancel"
    >
        <template #default="{ model, errors }">
            <div class="flex flex-col gap-4">
                <div>
                    <InputText 
                        v-model="model!.label" 
                        placeholder="Короткое наименование" 
                        fluid 
                    />
                    <ValidationMessage :error="errors['label']" />
                </div>
                <div>
                    <InputText 
                        v-model="model!.name" 
                        placeholder="Наименование" 
                        fluid 
                    />
                    <ValidationMessage :error="errors['name']" />
                </div>
                <div>
                    <Textarea 
                        v-model="model!.description" 
                        placeholder="Описание" 
                        fluid 
                    />
                </div>
            </div>
        </template>
    </ValidatableModelForm>
</template>