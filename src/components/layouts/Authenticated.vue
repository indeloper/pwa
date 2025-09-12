<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';
import { ref, onMounted, onUnmounted } from 'vue';
import MegaMenu from 'primevue/megamenu';
import { useRouter } from 'vue-router';
import ScrollTop from 'primevue/scrolltop';
import { throttle } from 'lodash';
import MaterialStandardApi from '@/api/MaterialStandardApi';

const authStore = useAuthStore();

const router = useRouter();

const handleLogout = () => {
    authStore.logout();
}

const avatarMenu = ref(null);

const toggleAvatarMenu = (event: Event) => {
    /** @ts-ignore */
    avatarMenu.value?.toggle(event);
};

const avatarMenuItems = ref([
    {
        items: [
            {
                label: 'Выход',
                command: () => handleLogout()
            },
        ]
    }
])

// Переменные для скрытия/показа шапки
const isHeaderVisible = ref(true);
const lastScrollY = ref(0);

// Улучшенная функция скролла с throttling
const handleScroll = throttle(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
        // Скролл вниз - скрываем шапку
        isHeaderVisible.value = false;
    } else if (currentScrollY < lastScrollY.value) {
        // Скролл вверх - показываем шапку
        isHeaderVisible.value = true;
    }

    lastScrollY.value = currentScrollY;
}, 100); // Задержка 100ms для плавности

// Добавляем и убираем слушатель скролла
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const megaMenuItems = ref([
    {
        label: 'Материалы',
        root: true,
        items: [
            [
                {
                    items: [
                        {
                            label: 'Материалы',
                            icon: 'pi pi-warehouse',
                            subtext: 'Материалы',
                            command: () => router.push({ name: 'accounting-materials' })
                        }
                    ]
                }
            ],
            [
                {
                    items: [
                        {
                            label: 'Склады',
                            icon: 'pi pi-warehouse',
                            subtext: 'Склады',
                            command: () => router.push({ name: 'library-materials-warehouses' })
                        }
                    ]
                }
            ],
        ]
    },
    {
        label: 'Справочники',
        root: true,
        items: [
            [
                {
                    items: [
                        {
                            label: 'Единицы измерения',
                            icon: 'pi pi-calculator',
                            subtext: 'Управление единицами измерения материалов',
                            command: () => router.push({ name: 'library-materials-units' })
                        },
                        {
                            label: 'Типы материалов',
                            icon: 'pi pi-tags',
                            subtext: 'Типы материалов',
                            command: () => router.push({ name: 'library-materials-types' })
                        },
                    ]
                }
            ],
            [
                {
                    items: [
                        {
                            label: 'Марки материалов',
                            icon: 'pi pi-star',
                            subtext: 'Марки материалов',
                            command: () => router.push({ name: 'library-materials-brands' })
                        },
                        {
                            label: 'Свойства',
                            icon: 'pi pi-cog',
                            subtext: 'Характеристики материалов',
                            command: () => router.push({ name: 'library-materials-properties' })
                        }
                    ]
                }
            ],

        ]
    }
])
</script>

<template>
    <div class="flex flex-col min-h-screen bg-gray-100 h-screen grid grid-rows-[auto_1fr_auto] max-w-[100vw]">
        <header :class="[
            'text-gray-800 md:px-2 md-pt-2 flex sticky top-0 z-50 transition-all duration-300 w-full',
            isHeaderVisible ? 'translate-y-0' : '-translate-y-full',
        ]">


            <MegaMenu :model="megaMenuItems" class="flex-1 p-4 bg-surface-0">
                <template #start>
                    <div class="flex items-center gap-2 hidden md:block hover:scale-105 transition-all duration-300 cursor-pointer"
                        @click="router.push('/')">
                        <span class="font-semibold text-lg">СК ГОРОД</span>
                    </div>
                    <div class="ml-8 flex items-center gap-2 hidden md:block hover:scale-105 transition-all duration-300 cursor-pointer"
                        @click="router.push('/test')">
                        <span class="font-semibold text-lg">TEST</span>
                    </div>
                </template>
                <template #item="{ item }">
                    <a v-if="item.root" class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative"
                        style="border-radius: 2rem">
                        <span>{{ item.label }}</span>
                    </a>
                    <a v-else class="flex items-center p-4 cursor-pointer mb-2 gap-3">
                        <span
                            class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12">
                            <i :class="[item.icon, 'text-lg']"></i>
                        </span>
                        <span class="inline-flex flex-col gap-1">
                            <span class="font-bold text-lg">{{ item.label }}</span>
                            <span class="whitespace-nowrap">{{ item.subtext }}</span>
                        </span>
                    </a>
                </template>
                <template #end>
                    <div v-if="authStore.getIsAuthenticated"
                        class="flex items-center cursor-pointer gap-4 hover:bg-gray-800/10 p-2 rounded-md transition-all duration-300"
                        @click="toggleAvatarMenu">
                        <Avatar :label="authStore.getUser?.initials" />
                        <div class="hidden md:block">
                            <p class="text-sm font-bold">{{ authStore.getUser?.short_name }}</p>
                            <p class="text-xs text-gray-500">{{ authStore.getUser?.email }}</p>
                        </div>
                        <Menu ref="avatarMenu" id="overlay_menu" :model="avatarMenuItems" :popup="true"
                            style="border: none;" />
                    </div>
                </template>
            </MegaMenu>


        </header>

        <main class="flex-1 px-2 md:px-8 py-2 h-full flex flex-col max-w-[99vw]">
            <div class="bg-white rounded-lg p-4 shadow flex-1 flex flex-col h-[80vh]">
                <slot />
            </div>
        </main>

        <ScrollTop />
    </div>
</template>