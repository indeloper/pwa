<script setup lang="ts" generic="T extends IValidatable">
import type { IValidatable } from '@/decorators/validation';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { computed, ref } from 'vue';
import { keyBy } from 'lodash';
import { DEFAULT_CANCEL_BUTTON_PROPS, DEFAULT_SAVE_BUTTON_PROPS } from '@/constants';

const emit = defineEmits<{
    (e: 'submit', model: T): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<T>('model', { required: true });
const loading = defineModel<boolean>('loading', { required: true });
const submitted = ref(false);

const handleSubmit = () => {
    submitted.value = true;
    
    if (!model.value.isValid()) {
        return;
    }
    
    emit('submit', model.value);
};

const handleCancel = () => {
    submitted.value = false;
    emit('cancel');
};

const errors = computed(() => {
    if (!submitted.value) {
        return {};
    }
    
    return keyBy(model.value.validationErrors(), 'property');
});

</script>

<template>
    <div>
        <slot :model="model" :errors="errors" :touched="submitted" />
        <Divider />
        <div class="flex gap-2 justify-end">
            <Button v-bind="DEFAULT_CANCEL_BUTTON_PROPS" @click="handleCancel" :disabled="loading" />
            <Button v-bind="DEFAULT_SAVE_BUTTON_PROPS" @click="handleSubmit" :disabled="loading" />
        </div>
    </div>
</template>
