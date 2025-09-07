<script setup lang="ts">
import type { ValidationError } from '@/decorators/validation';

const props = defineProps<{
    error: ValidationError | undefined;
}>();
</script>

<template>
    <div v-if="error" class="text-red-500 text-xs mt-1">
        {{ error.message }}
    </div>
</template>