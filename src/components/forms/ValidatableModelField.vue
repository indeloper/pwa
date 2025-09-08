<script setup lang="ts" generic="T extends IValidatable">
import type { IValidatable } from '@/decorators/validation';
import ValidationMessage from '../ui/ValidationMessage.vue';

const props = defineProps<{ 
    model: T;
    property: string;
    label: string;
    touched: boolean;
    hideDescription?: boolean;
}>();
</script>

<template>
    <div class="flex flex-col">
        <label :for="property">
            {{ label }}
            <span v-if="model.isRequired(property)" class="text-red-500">*</span>   
        </label>
        <slot :model="model" :property="property" />
        <p v-if="model?.descriptions?.[property] && !hideDescription" class="text-sm text-gray-500">
            {{ model?.descriptions?.[property] }}
        </p>
        <ValidationMessage v-if="touched"
            :error="model.validationErrors().find(error => error.property === property)" />
    </div>
</template>