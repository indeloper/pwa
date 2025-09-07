<script setup lang="ts">
import Drawer from 'primevue/drawer';

const model = defineModel<boolean>({ required: true });
</script>

<template>
    <Drawer v-model:visible="model" position="bottom">
        <template #container="{ closeCallback }">
            menu
        </template>
        
    </Drawer>
</template>

<style scoped>
</style>
