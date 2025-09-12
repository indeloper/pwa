<script setup lang="ts">
import Button from 'primevue/button';
import { nextTick, ref } from 'vue';



const props = defineProps<{
    title?: string;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const placeholderStyle = ref<Record<string, string> | null>(null);
let lastClosedRect: DOMRect | null = null;

const animateOpen = async () => {
    const el = containerRef.value;
    if (!el) return;

    lastClosedRect = el.getBoundingClientRect();
    placeholderStyle.value = { height: `${lastClosedRect.height}px` };

    isOpen.value = true;
    await nextTick();

    const endRect = el.getBoundingClientRect();
    const dx = lastClosedRect.left - endRect.left;
    const dy = lastClosedRect.top - endRect.top;
    const sx = lastClosedRect.width / endRect.width;
    const sy = lastClosedRect.height / endRect.height;

    el.style.willChange = 'transform';
    el.style.transformOrigin = 'top left';
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    el.style.transition = 'transform 0s';

    requestAnimationFrame(() => {
        el.style.transition = 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = 'translate(0, 0) scale(1, 1)';
    });
};

const animateClose = () => {
    const el = containerRef.value;
    if (el) {
        el.style.transition = '';
        el.style.transform = '';
        el.style.willChange = '';
    }
    isOpen.value = false;
    placeholderStyle.value = null;
};

const handleClose = () => {
    animateClose();
};

const handleOpen = () => {
    animateOpen();
};

</script>

<template>
    <div class="w-full">
        <div v-if="isOpen" :style="placeholderStyle"></div>

        <div
            ref="containerRef"
            class="flex flex-col bg-white"
            :class="[
                isOpen ? 'fixed inset-0 z-50 rounded-none shadow-none transition-all ease-in-out duration-300' : 'w-full'
            ]"
        >
            <div class="flex items-center gap-2 p-4 " :class="isOpen ? 'border-b border-gray-200 justify-between' : 'justify-start'">
                <p v-if="props.title" class="text-2xl font-bold">{{ props.title }}</p>
                <Button :icon="isOpen ? 'pi pi-times' : 'pi pi-window-maximize'" @click="isOpen ? handleClose() : handleOpen()" text rounded />
            </div>
            <div :class="isOpen ? 'flex-1 overflow-auto p-4' : 'p-0'">
                <slot />
            </div>
        </div>

        <!-- Removed background overlay to avoid flicker and because fullscreen covers page -->
    </div>
    
</template>