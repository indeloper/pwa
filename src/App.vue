<script setup lang="ts">
import { onMounted } from 'vue';
import Authenticated from './components/layouts/Authenticated.vue';
import { useAuthStore } from './stores/auth';
import ConfirmDialog from 'primevue/confirmdialog';
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from 'primevue/toast';
import Loader from './components/ui/Loader.vue';
import { refreshLibraries } from './workers/tasks/refreshLibraries';
import ErrorBoundary from 'vue-error-boundary'
import Textarea from 'primevue/textarea';

const authStore = useAuthStore();

onMounted(() => {
  refreshLibraries();
  authStore.initializeAuth();
});
</script>

<template>
  <div class="font-montserrat">
    <Authenticated>
        <router-view />
    </Authenticated>
    <ConfirmDialog group="confirm-empty-fields">
      <template #message="{ message }">
        <div v-if="message && (message.message as any).fields" class="flex flex-col gap-3 w-full">
          <p class="text-sm">Следующие поля оставлены пустыми:</p>
          <ul class="list-disc pl-5 text-sm">
            <li v-for="f in (message.message as any).fields" :key="f.name">{{ f.label || f.name }}</li>
          </ul>
          <div v-if="(message.message as any).requireJustification" class="flex flex-col gap-2 w-full">
            <label class="text-sm text-gray-600">Укажите причину</label>
            <Textarea fluid v-model="(message.message as any).justification.value" rows="3" auto-resize placeholder="Причина" />
          </div>
        </div>
      </template>
    </ConfirmDialog>
    <ConfirmDialog></ConfirmDialog>
    <Toast position="top-center" group="toast"></Toast>
    <Toast position="bottom-center" group="system-toast"></Toast>
    <DynamicDialog></DynamicDialog>
    <Loader></Loader>
  </div>
</template>

<style scoped></style>
