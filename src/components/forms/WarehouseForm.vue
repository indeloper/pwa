<script setup lang="ts">
import type Warehouse from '@/models/Warehouse';
import BaseResourceForm from '@/components/forms/BaseResourceForm.vue';

const emit = defineEmits<{
    (e: 'submit', model: Warehouse): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<Warehouse>('model', { required: true });
const loading = defineModel<boolean>('loading', { required: true });

const handleSubmit = (model: Warehouse) => {
    emit('submit', model);
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <BaseResourceForm v-model:model="model" :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
</template>