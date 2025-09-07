<script setup lang="ts">
import { onMounted, onUnmounted, reactive, computed } from 'vue';
import { useLoader, type LoaderData } from '@/composables/useLoader';
import ProgressBar from 'primevue/progressbar';
import LoadingSpinner from './LoadingSpinner.vue';
import { Check } from '@vicons/fa';
import { AlertCircleOutline, CloseCircleOutline } from '@vicons/ionicons5';

type LoaderState = LoaderData & { visible: boolean; pendingClose?: boolean; finalMessageShown?: boolean; finalStatus?: 'success' | 'error' };

const loaders = reactive<Record<string, LoaderState>>({});

const { onStart, onUpdate, onStop } = useLoader();

let offStart: (() => void) | null = null;
let offUpdate: (() => void) | null = null;
let offStop: (() => void) | null = null;

onMounted(() => {
    offStart = onStart(({ id, data }) => {
        loaders[id] = {
            message: data?.message,
            percent: data?.percent,
            count: data?.count ?? 0,
            min: data?.min,
            max: data?.max,
            visible: true,
        };
    });

    offUpdate = onUpdate(({ id, data }) => {
        if (!loaders[id]) return;
        Object.assign(loaders[id], data);
    });

    offStop = onStop(({ id, finalMessage, durationMs, finalStatus }) => {
        const st = loaders[id];
        if (!st) return;
        if (finalMessage) {
            st.message = finalMessage;
            st.percent = undefined;
            st.min = undefined;
            st.max = undefined;
            st.finalMessageShown = true;
            st.finalStatus = finalStatus ?? 'success';
            st.pendingClose = true;
            setTimeout(() => {
                if (loaders[id]) loaders[id].visible = false;
            }, typeof durationMs === 'number' ? durationMs : 2000);
        } else {
            st.visible = false;
        }
    });
});

onUnmounted(() => {
    offStart?.();
    offUpdate?.();
    offStop?.();
});

const visibleLoaders = computed(() =>
    Object.entries(loaders).filter(([, st]) => st.visible)
);
</script>

<template>
    <div class="fixed left-1/2 -translate-x-1/2 bottom-4 z-[2000] pointer-events-none">
        <TransitionGroup name="loader-slide" tag="div" class="flex flex-col gap-2 items-center">
            <div v-for="([id, st], idx) in visibleLoaders" :key="id"
                class="pointer-events-auto rounded-md bg-gray-100 shadow text-center w-[260px] h-[32px] px-3 py-2 flex flex-col items-center justify-between">
                <div class="flex items-center gap-2 h-6 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                    <template v-if="st.message">
                        <template v-if="st.finalMessageShown">
                            <Check v-if="st.finalStatus === 'success'" class="text-green-500 w-4 h-4" />
                            <CloseCircleOutline v-else class="text-red-500 w-5 h-5" />
                        </template>
                        <template v-else>
                            <LoadingSpinner />
                        </template>
                        {{ st.message }}
                    </template>
                    <template v-else>
                        <!-- spacer to keep fixed height -->
                    </template>
                </div>
                <div class="h-1.5 px-1.5">
                    <template v-if="!st.finalMessageShown">
                        <ProgressBar v-if="st.percent !== undefined" :value="parseFloat(Number(st.percent).toFixed(0))" style="height: 6px" />
                        <ProgressBar v-else-if="st.min !== undefined && st.max !== undefined" :value="st.count" style="height: 6px" />
                        <ProgressBar v-else-if="st.message" mode="indeterminate" style="height: 6px" />
                        <div v-else class="h-[6px]"></div>
                    </template>
                    <div v-else class="h-[6px]"></div>
                </div>
            </div>
        </TransitionGroup>
    </div>

</template>

<style scoped>
.loader-slide-enter-active,
.loader-slide-leave-active {
    transition: transform 200ms ease, opacity 200ms ease;
}

.loader-slide-enter-from,
.loader-slide-leave-to {
    transform: translateY(12px);
    opacity: 0;
}
</style>