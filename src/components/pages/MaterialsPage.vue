<script setup lang="ts">
import WarehouseSelector from '@/components/ui/WarehouseSelector.vue';
import MaterialPageMenu from '@/components/ui/MaterialPageMenu.vue';
import Divider from 'primevue/divider';
</script>

<template>
    <div class="flex flex-col gap-4">
        <WarehouseSelector />
        <MaterialPageMenu />

        <router-view />
    </div>
</template>
