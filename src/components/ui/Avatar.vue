<script setup lang="ts">
import { User } from '@vicons/fa';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  alt?: string;
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  src: '',
  alt: ''
});
</script>

<template>
  <div class="avatar" :class="`avatar--${size}`">
    <img 
      v-if="src" 
      :src="src" 
      :alt="alt || 'Avatar'"
      class="avatar__image"
    />
    <User v-else class="avatar__icon" />
  </div>
</template>

<style scoped>
/* Component-specific styles can be added here if needed */
</style>