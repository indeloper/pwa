<script setup lang="ts">
import type MaterialProperty from '@/models/MaterialProperty';
import BaseResourceForm from '@/components/forms/BaseResourceForm.vue';

const emit = defineEmits<{
    (e: 'submit', model: MaterialProperty): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<MaterialProperty>('model', { required: true });
const loading = defineModel<boolean>('loading', { required: true });

const handleSubmit = (model: MaterialProperty) => {
    emit('submit', model);
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <BaseResourceForm v-model:model="model" :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
</template>