<script setup lang="ts">
import { ref } from 'vue';
import type MaterialBrand from '@/models/MaterialBrand';
import Dialog from 'primevue/dialog';

interface Props {
    asDialog?: boolean;
    brand?: MaterialBrand;
}

const visible = defineModel<boolean>('visible');

const props = withDefaults(
    defineProps<Props>(), {}
);

</script>

<template>
    <Dialog v-if="asDialog" v-model:visible="visible" header="Добавление бренда" modal>
        <div>
            <h1>MaterialBrandForm</h1>
            <p>Brand: {{ brand }}</p>
        </div>
    </Dialog>
    <div v-else>
        <h1>MaterialBrandForm</h1>
        <p>Brand: {{ brand }}</p>
    </div>
</template>