<script setup lang="ts">
import { CircleNotch } from '@vicons/fa'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'white' | 'gray' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'gray'
})

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5', 
  lg: 'h-6 w-6'
}

const colorClasses = {
  white: 'text-white',
  gray: 'text-gray-500',
  primary: 'text-indigo-600'
}
</script>

<template>
  <CircleNotch 
    class="animate-spin" 
    :class="[sizeClasses[size], colorClasses[color]]" 
  />
</template>
