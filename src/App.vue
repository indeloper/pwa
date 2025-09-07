<script setup lang="ts">
import { onMounted } from 'vue';
import Authenticated from './components/layouts/Authenticated.vue';
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia';
import ConfirmDialog from 'primevue/confirmdialog';
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from 'primevue/toast';
import Loader from './components/ui/Loader.vue';
// Демонстрация: запуск тестового прогресс-лоадера только в dev
if (import.meta.env.DEV) {
  import('@/workers/tasks/demoLoaderProgress').then(({ enqueueDemoLoaderProgressTask }) => {
    enqueueDemoLoaderProgressTask('system-loader');
  });
}
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

onMounted(() => {
  authStore.initializeAuth();
});
</script>

<template>
  <div class="font-montserrat">
    <Authenticated>
      <router-view />
    </Authenticated>
    <ConfirmDialog></ConfirmDialog>
    <Toast position="top-center" group="toast"></Toast>
    <Toast position="bottom-center" group="system-toast"></Toast>
    <DynamicDialog></DynamicDialog>
    <Loader></Loader>
  </div>
</template>

<style scoped></style>
