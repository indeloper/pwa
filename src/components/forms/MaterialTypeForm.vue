<script setup lang="ts">
import type MaterialType from '@/models/MaterialType';
import BaseResourceForm from '@/components/forms/BaseResourceForm.vue';
import { onMounted } from 'vue';

const emit = defineEmits<{
    (e: 'submit', model: MaterialType): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<MaterialType>('model', { required: true });
const loading = defineModel<boolean>('loading', { required: true });

const handleSubmit = (model: MaterialType) => {
    emit('submit', model);
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <BaseResourceForm v-model:model="model" :loading="loading" @submit="handleSubmit" @cancel="handleCancel" />
</template>