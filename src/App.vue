<script setup lang="ts">
import { onMounted } from 'vue';
import Authenticated from './components/layouts/Authenticated.vue';
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia';
import ConfirmDialog from 'primevue/confirmdialog';
import DynamicDialog from 'primevue/dynamicdialog';
import Toast from 'primevue/toast';
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

onMounted(() => {
  authStore.initializeAuth();
});
</script>

<template>
  <div class="font-montserrat">
    <Authenticated v-if="isAuthenticated">
      <router-view />
    </Authenticated>
    <router-view v-else />
    <ConfirmDialog></ConfirmDialog>
    <Toast></Toast>
    <DynamicDialog></DynamicDialog>
  </div>
</template>

<style scoped>
</style>
