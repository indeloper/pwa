<script setup lang="ts" generic="T extends IValidatable">
import type { IValidatable } from '@/decorators/validation';
import ValidationMessage from '../ui/ValidationMessage.vue';

const props = defineProps<{
    model: T;
    property: string;
    label: string;
    touched: boolean;
}>();
</script>

<template>
    <div>
        <label :for="property">
            {{ label }}
            <span v-if="model.isRequired(property)" class="text-red-500">*</span>
        </label>
        <slot :model="model" :property="property" />
        <ValidationMessage v-if="touched" :error="model.validationErrors().find(error => error.property === property)" />
    </div>
</template>