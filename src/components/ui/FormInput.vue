<script setup lang="ts">
interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  rounded?: 'none' | 'top' | 'bottom' | 'both'
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  rounded: 'both'
})

const roundedClasses = {
  none: '',
  top: 'rounded-t-md',
  bottom: 'rounded-b-md', 
  both: 'rounded-md'
}

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div>
    <label v-if="label" :for="label" class="sr-only">{{ label }}</label>
    <input
      :id="label"
      :type="type"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm',
        roundedClasses[rounded],
        error ? 'border-red-300' : 'border-gray-300',
        disabled ? 'bg-gray-100 cursor-not-allowed' : ''
      ]"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
