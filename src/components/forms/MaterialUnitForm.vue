<script setup lang="ts">
import type MaterialUnit from '@/models/MaterialUnit';
import BaseResourceForm from '@/components/forms/BaseResourceForm.vue';

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
    <BaseResourceForm v-model:model="model" @submit="handleSubmit" @cancel="handleCancel" :loading="loading" />
</template>