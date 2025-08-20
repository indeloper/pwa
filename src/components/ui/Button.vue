<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps, ButtonEmits } from '../../types/button';

// Props with defaults
const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'filled',
  severity: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  iconPosition: 'left',
  iconOnly: false,
  fluid: false,
  rounded: 'default',
  type: 'button'
});

// Emits
const emit = defineEmits<ButtonEmits>();

// Computed properties
const isDisabled = computed(() => props.loading || props.disabled);

const buttonClasses = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.severity}`,
  `btn--${props.size}`,
  {
    'btn--icon-only': props.iconOnly,
    'btn--loading': props.loading,
    'btn--fluid': props.fluid,
    [`btn--rounded-${props.rounded}`]: props.rounded !== 'default'
  }
]);

// Event handlers
const handleClick = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit('click', event);
  }
};
</script>

<template>
  <button 
    :class="buttonClasses" 
    @click="handleClick" 
    :disabled="isDisabled"
    :type="type"
    :aria-label="iconOnly && icon ? undefined : undefined"
    :aria-disabled="isDisabled"
  >
    <!-- Loading state -->
    <span v-if="loading" class="btn__spinner">
      <svg 
        class="animate-spin h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle 
          class="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          stroke-width="4"
        />
        <path 
          class="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>

    <!-- Icon only button -->
    <span v-else-if="icon && iconOnly" class="btn__content">
      <component :is="icon" class="w-4 h-4" aria-hidden="true" />
    </span>

    <!-- Button with content and optional icons -->
    <span v-else class="btn__content">
      <!-- Left icon -->
      <component 
        v-if="icon && iconPosition === 'left'" 
        :is="icon" 
        class="w-4 h-4" 
        aria-hidden="true"
      />
      
      <!-- Button content -->
      <slot />
      
      <!-- Right icon -->
      <component 
        v-if="icon && iconPosition === 'right' && !loading" 
        :is="icon" 
        class="w-4 h-4" 
        aria-hidden="true"
      />
    </span>
  </button>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>
