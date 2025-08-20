<script setup lang="ts">
import { ref } from 'vue'
import { SignInAlt } from '@vicons/fa'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

interface Props {
  title?: string
  submitText?: string
  loading?: boolean
  error?: string
}

const emit = defineEmits<{
  (e: 'submit', data: { email: string; password: string }): void
}>()

const props = withDefaults(defineProps<Props>(), {
  title: 'Войти в аккаунт',
  submitText: 'Войти',
  loading: false
})

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  emit('submit', {
    email: email.value,
    password: password.value
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ title }}
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <InputText v-model="email" type="email" placeholder="Email" label="Email" required fluid />
          <InputText v-model="password" type="password" placeholder="Пароль" label="Пароль" required fluid />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <Button label="Войти" @click="handleSubmit" :loading="loading" :icon="SignInAlt" icon-position="left" fluid />
        </div>
      </form>
    </div>
  </div>
</template>
