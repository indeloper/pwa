<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import { useAppStore } from '../../stores/app';
import { useAuthApi } from '../../composables/useAuthApi';
import AuthForm from '../auth/AuthForm.vue';

const authStore = useAuthStore();
const appStore = useAppStore();
const authApi = useAuthApi();

const handleSubmit = async (data: { email: string; password: string }) => {
  try {
    appStore.clearError();

    await authStore.login(data.email, data.password);

    appStore.addNotification({
      type: 'success',
      message: 'Успешный вход в систему!',
      duration: 3000
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ошибка входа. Проверьте email и пароль.';
    appStore.setError(errorMessage);
    appStore.addNotification({
      type: 'error',
      message: errorMessage,
      duration: 5000
    });
  }
}
</script>

<template>
  <AuthForm
    title="Вход в систему"
    submit-text="Войти"
    :loading="authApi.loading.value"
    :error="appStore.getError"
    @submit="handleSubmit"
  />
</template>



<style scoped></style>
