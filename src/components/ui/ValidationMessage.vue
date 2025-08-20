<script setup lang="ts">
import type { ValidationError } from '@/decorators/validation';

const props = defineProps<{
    error: ValidationError;
}>();
</script>

<template>
    <div v-if="error" class="text-red-500 text-sm mt-1">
        {{ error.message }}
    </div>
</template>