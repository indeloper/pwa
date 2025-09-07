<script setup lang="ts">
import MaterialOperationApi from '@/api/MaterialOperationApi';
import { onUnmounted, computed, ref } from 'vue';
import Chart from 'primevue/chart';
import ChartJS from 'chart.js/auto';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import zoomPlugin from 'chartjs-plugin-zoom';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import SelectButton from 'primevue/selectbutton';
import Drawer from 'primevue/drawer';

// Регистрация плагина масштабирования/панорамирования
ChartJS.register(zoomPlugin);




const { items, loading, progress, completed, error, stop } = MaterialOperationApi.fetchAllStream();

// Все уникальные и отсортированные даты (YYYY-MM-DD)
const allLabels = computed(() => {
    const set = new Set<string>();
    for (const raw of items.value as any[]) {
        if (!raw) continue;
        const dateStr = String(raw.operation_date || '').slice(0, 10);
        if (dateStr) set.add(dateStr);
    }
    return Array.from(set).sort();
});

// Уникальные даты в порядке убывания (от большей к меньшей)
const uniqueDatesDesc = computed(() => {
    const uniqueDates = new Set<string>();
    // Проходим по items в том порядке, в котором они приходят (от большей даты к меньшей)
    for (const raw of items.value as any[]) {
        if (!raw) continue;
        const dateStr = String(raw.operation_date || '').slice(0, 10);
        if (dateStr) uniqueDates.add(dateStr);
    }
    // Возвращаем массив в том же порядке, как добавлялись (от большей к меньшей)
    return Array.from(uniqueDates);
});

// Создаем вкладки для каждой уникальной даты
const scrollableTabs = computed(() => {
    return uniqueDatesDesc.value.map((date, index) => ({
        title: date,
        content: date,
        value: index.toString(),
        date: date
    }));
});

// Активная вкладка
const activeTabIndex = ref('0');

// Текущая выбранная дата
const currentDate = computed(() => {
    const tab = scrollableTabs.value.find(t => t.value === activeTabIndex.value);
    return tab?.date || '';
});

// Отфильтрованные данные для текущей даты
const filteredItems = computed(() => {
    if (!currentDate.value) return [];
    return items.value.filter((item: any) => {
        if (!item) return false;
        const itemDate = String(item.operation_date || '').slice(0, 10);
        return itemDate === currentDate.value;
    });
});

// Интерфейс для снапшота материала
interface MaterialSnapshot {
    standard_id: number;
    material_standard_name: string;
    quantity_current: number;
    last_operation_date: string;
    last_operation_name: string;
    object_name?: string;
    accounting_type: number;
    type2_quantity_param?: string | null;
    last_from_object_name?: string | null;
    last_to_object_name?: string | null;
    last_from_object_id?: number | null;
    last_to_object_id?: number | null;
}

// Предварительно построенные снапшоты состояния материалов для каждой даты
const materialSnapshots = computed(() => {
    const snapshots = new Map<string, Map<string, MaterialSnapshot>>();
    
    // Сортируем все операции по дате и времени
    const sortedItems = [...items.value].sort((a: any, b: any) => {
        const dateA = new Date(a.operation_date).getTime();
        const dateB = new Date(b.operation_date).getTime();
        return dateA - dateB;
    });
    
    // Строим снапшоты пошагово для каждой даты
    const materialStates = new Map<string, MaterialSnapshot>();
    
    for (const item of sortedItems as any[]) {
        if (!item) continue;
        
        const dateStr = String(item.operation_date || '').slice(0, 10);
        const standardId = item.standard_id;
        const accountingType = Number(item.accounting_type ?? 0);
        const type2Param = accountingType === 2 ? String(item.quantity_param_for_type2 ?? '') : '';
        const qty = parseFloat(String(item.quantity_after_total ?? '0'));
        
        if (!dateStr || standardId == null || !isFinite(qty)) continue;
        
        // Обновляем состояние материала
        const key = accountingType === 2 ? `${standardId}::${type2Param}` : String(standardId);
        materialStates.set(key, {
            standard_id: standardId,
            material_standard_name: item.material_standard_name || `standard_${standardId}`,
            quantity_current: qty,
            last_operation_date: item.operation_date,
            last_operation_name: item.operation_name || 'Операция',
            object_name: item.object_name,
            accounting_type: accountingType,
            type2_quantity_param: accountingType === 2 ? type2Param : null,
            last_from_object_name: item.from_object_name ?? null,
            last_to_object_name: item.to_object_name ?? null,
            last_from_object_id: item.from_object_id ?? null,
            last_to_object_id: item.to_object_id ?? null
        });
        
        // Сохраняем снапшот для этой даты (копируем текущее состояние)
        if (!snapshots.has(dateStr)) {
            snapshots.set(dateStr, new Map());
        }
        
        // Обновляем снапшот для всех материалов на эту дату
        const dateSnapshot = snapshots.get(dateStr)!;
        for (const [stateKey, state] of materialStates.entries()) {
            dateSnapshot.set(stateKey, { ...state });
        }
    }
    
    return snapshots;
});

// Снапшот материалов для текущей выбранной даты
const currentSnapshot = computed(() => {
    if (!currentDate.value) return [];
    
    const snapshot = materialSnapshots.value.get(currentDate.value);
    if (!snapshot) return [];
    
    return Array.from(snapshot.values())
        .filter(material => material.quantity_current > 0) // Показываем только материалы с остатком
        .sort((a, b) => b.quantity_current - a.quantity_current); // Сортируем по убыванию количества
});

// Переключатель между операциями и состоянием материалов
const viewMode = ref<'operations' | 'materials'>('materials');

// Опции для переключателя режимов просмотра
const viewModeOptions = ref([
    { label: 'Операции за день', value: 'operations' },
    { label: 'Состояние материалов', value: 'materials' }
]);

// Drawer для детализации материала
const drawerVisible = ref(false);
const selectedMaterial = ref<MaterialSnapshot | null>(null);

// Все операции по выбранному материалу
const materialOperations = computed(() => {
    if (!selectedMaterial.value) return [];
    
    return items.value
        .filter((item: any) => {
            if (!item) return false;
            const sameStandard = item.standard_id === selectedMaterial.value?.standard_id;
            if (!sameStandard) return false;
            const accType = Number(item.accounting_type ?? 0);
            if (selectedMaterial.value?.accounting_type === 2) {
                const param = String(item.quantity_param_for_type2 ?? '');
                return String(selectedMaterial.value?.type2_quantity_param ?? '') === param;
            }
            return accType !== 2; // для типов отличных от 2 берём все записи по стандарту
        })
        .sort((a: any, b: any) => new Date(a.operation_date).getTime() - new Date(b.operation_date).getTime());
});

// График изменения количества материала во времени
const materialChartData = computed(() => {
    if (!selectedMaterial.value || materialOperations.value.length === 0) {
        return { labels: [], datasets: [] };
    }
    
    const operations = materialOperations.value as any[];
    const labels = operations.map(op => String(op.operation_date || '').slice(0, 10));
    const quantities = operations.map(op => parseFloat(String(op.quantity_after_total ?? '0')));
    
    const documentStyle = getComputedStyle(document.documentElement);
    const primaryColor = documentStyle.getPropertyValue('--p-primary-500') || '#3b82f6';
    
    return {
        labels,
        datasets: [{
            label: `${selectedMaterial.value.material_standard_name}`,
            data: quantities,
            fill: false,
            borderColor: primaryColor,
            backgroundColor: primaryColor,
            tension: 0.2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };
});

// График опции для детализации материала
const materialChartOptions = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `История изменения количества: ${selectedMaterial.value?.material_standard_name || ''}`,
                color: textColor
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Дата операции',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Количество',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
});

// Обработчик клика на строку материала
const handleMaterialRowClick = (event: any) => {
    const material = event.data as MaterialSnapshot;
    selectedMaterial.value = material;
    drawerVisible.value = true;
};

// Готовим реактивные опции для графика (с ограничением оси X)
const chartOptions = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x'
                },
                zoom: {
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'x'
                },
                limits: {
                    x: { min: 'original', max: 'original' }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    } as any;
});

const chartData = computed(() => {
    // Сбор и агрегирование по standard_id
    const byStandard = new Map<number | string, Map<string, number>>();

    for (const raw of items.value as any[]) {
        if (!raw) continue;
        const dateStr = String(raw.operation_date || '').slice(0, 10);
        const standardId = raw.standard_id;
        const qty = parseFloat(String(raw.quantity_after_total ?? '0'));
        if (!dateStr || standardId == null || !isFinite(qty)) continue;

        if (!byStandard.has(standardId)) byStandard.set(standardId, new Map());
        const dateMap = byStandard.get(standardId)!;
        // На одну дату может быть несколько записей — агрегируем суммой
        dateMap.set(dateStr, (dateMap.get(dateStr) ?? 0) + qty);
    }

    const labels = allLabels.value;

    const documentStyle = getComputedStyle(document.documentElement);
    const colorVars = [
        '--p-cyan-500',
        '--p-orange-500',
        '--p-indigo-500',
        '--p-pink-500',
        '--p-emerald-500',
        '--p-yellow-500',
        '--p-teal-500',
        '--p-blue-500',
        '--p-purple-500',
        '--p-red-500',
        '--p-lime-500',
        '--p-amber-500',
        '--p-sky-500',
        '--p-violet-500'
    ];

    const datasets = Array.from(byStandard.entries()).map(([sid, dateMap], idx) => {
        const color = (documentStyle.getPropertyValue(colorVars[idx % colorVars.length]) || '#4b9ce2').trim();
        const data = labels.map((d) => (dateMap.get(d) ?? null));
        return {
            label: `standard_id ${sid}`,
            data,
            fill: false,
            borderColor: color,
            backgroundColor: color,
            tension: 0.3,
            spanGaps: true
        } as any;
    });

    return {
        labels,
        datasets
    } as any;
});

onUnmounted(() => {
    stop();
});
</script>

<template>
    <div >
        <!-- <pre>
            {{ loading }}
            {{ progress }}
            {{ completed }}
            {{ error }}
        </pre> -->
        
        <!-- <ProgressBar :value="items.length"> {{ items.length }}/100 </ProgressBar> -->
        <!-- Индикатор загрузки -->
        <div v-if="loading" class="mb-4">
            <div>Загрузка данных...</div>
            <div v-if="progress" class="mt-2">
                <div>Общий прогресс: {{ progress.percentage }}% ({{ progress.current }} / {{ progress.total }})</div>
                <div v-if="progress.chunk_size" class="text-sm text-gray-600">
                    Размер чанка: {{ progress.chunk_size }}
                </div>
            </div>
        </div>

        <!-- <Timeline :value="items">
            <template #content="slotProps">
                {{ slotProps.item.operation_id }}
            </template>
        </Timeline> -->

        <!-- <VirtualScroller :items="items" :itemSize="50" class="border border-surface-200 dark:border-surface-700 rounded" style="width: 200px; height: 200px">
            <template v-slot:item="{ item, options }">
                <div :class="['flex items-center p-2']" style="height: 50px">{{ item.operation_id }}</div>
            </template>
        </VirtualScroller> -->
        
        
        <!-- Ошибка -->
        <div v-if="error" class="text-red-500 mb-4">
            Ошибка: {{ error }}
        </div>
        
        <!-- Статус завершения -->
        <div v-if="completed" class="text-green-500 mb-4">
            ✅ Загрузка завершена! Получено записей: {{ items.length }}
        </div>
    
        
        <!-- Показываем количество записей -->
        <div v-if="items.length > 0" class="mt-4 text-sm text-gray-600">
            Отображено записей: {{ items.length }}
        </div>

        <Tabs v-model:value="activeTabIndex" scrollable>
            <TabList>
                <Tab v-for="tab in scrollableTabs" :key="tab.title" :value="tab.value">
                    {{ tab.title }}
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="tab in scrollableTabs" :key="tab.content" :value="tab.value">
                    <div class="text-center text-gray-500 py-4">
                        Выбрана дата: {{ tab.date }}
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>

        <!-- Контент с переключателем режимов -->
        <div v-if="currentDate" class="mt-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">
                    {{ viewMode === 'operations' ? `Операции за ${currentDate}` : `Состояние материалов на ${currentDate}` }}
                </h3>
                
                <SelectButton 
                    v-model="viewMode" 
                    :options="viewModeOptions" 
                    option-label="label" 
                    option-value="value" 
                    aria-labelledby="basic" 
                />
            </div>
            
            <!-- Таблица операций -->
            <DataTable 
                v-if="viewMode === 'operations'"
                :value="filteredItems" 
                scrollable 
                scrollHeight="400px" 
                :virtual-scroller-options="{ itemSize: 50 }"
            >
                <Column field="operation_id" header="ID операции" sortable />
                <Column field="operation_name" header="Операция" sortable />
                <Column field="object_name" header="Объект" sortable />
                <Column field="material_standard_name" header="Материал" sortable />
                <Column field="quantity_after_total" header="Количество после" sortable>
                    <template #body="slotProps">
                        {{ parseFloat(String(slotProps.data.quantity_after_total ?? '0')).toFixed(3) }}
                    </template>
                </Column>
                <Column field="move_quantity_total" header="Перемещено" sortable>
                    <template #body="slotProps">
                        {{ parseFloat(String(slotProps.data.move_quantity_total ?? '0')).toFixed(3) }}
                    </template>
                </Column>
                <Column field="accounting_type" header="Тип учета" sortable />
            </DataTable>
            
            <!-- Таблица состояния материалов -->
            <DataTable 
                v-if="viewMode === 'materials'"
                :value="currentSnapshot" 
                scrollable 
                scrollHeight="800px" 
                :virtual-scroller-options="{ itemSize: 50 }"
                selection-mode="single"
                @row-click="handleMaterialRowClick"
                :row-hover="true"
                class="cursor-pointer"
            >
                <Column field="standard_id" header="ID стандарта" sortable />
                <Column field="type2_quantity_param" header="Партия/номинал (type=2)" sortable>
                    <template #body="slotProps">
                        <span v-if="slotProps.data.accounting_type === 2">{{ slotProps.data.type2_quantity_param }}</span>
                        <span v-else class="text-gray-400">—</span>
                    </template>
                </Column>
                <Column field="material_standard_name" header="Материал" sortable />
                <Column header="Из" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.last_from_object_name || '—' }}
                    </template>
                </Column>
                <Column header="В" sortable>
                    <template #body="slotProps">
                        {{ slotProps.data.last_to_object_name || '—' }}
                    </template>
                </Column>
                <Column field="quantity_current" header="Текущее количество" sortable>
                    <template #body="slotProps">
                        <span class="font-semibold text-green-600">
                            {{ slotProps.data.quantity_current.toFixed(3) }}
                        </span>
                    </template>
                </Column>
                <Column field="last_operation_name" header="Последняя операция" sortable />
                <Column field="last_operation_date" header="Дата последней операции" sortable>
                    <template #body="slotProps">
                        {{ new Date(slotProps.data.last_operation_date).toLocaleDateString('ru-RU') }}
                    </template>
                </Column>
                <Column field="object_name" header="Объект" sortable />
            </DataTable>
            
            <div class="mt-2 text-sm text-gray-600">
                <span v-if="viewMode === 'operations'">
                    Всего операций за {{ currentDate }}: {{ filteredItems.length }}
                </span>
                <span v-else>
                    Всего материалов с остатком на {{ currentDate }}: {{ currentSnapshot.length }}
                </span>
            </div>
        </div>

        <!-- График: по осям дата (X) и quantity_after_total (Y), линии по standard_id -->
        <!-- <div v-if="items.length > 0" class="card mt-6 flex-1 h-full max-h-[80vh]">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-full" />
        </div> -->

        <pre>
            {{ items?.[0] }}
        </pre>

        <!-- Drawer для детализации материала -->
        <Drawer v-model:visible="drawerVisible" position="right" class="!w-[90vw] lg:!w-[70vw]">
            <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-chart-line text-xl"></i>
                    <span class="font-semibold text-lg">
                        {{ selectedMaterial?.material_standard_name || 'Детализация материала' }}
                    </span>
                </div>
            </template>

            <div v-if="selectedMaterial" class="space-y-6">
                <!-- Информация о материале -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-semibold mb-3">Информация о материале</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <span class="text-sm text-gray-600">ID стандарта:</span>
                            <div class="font-semibold">{{ selectedMaterial.standard_id }}</div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Тип учета:</span>
                            <div class="font-semibold">{{ selectedMaterial.accounting_type }}</div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Название:</span>
                            <div class="font-semibold">{{ selectedMaterial.material_standard_name }}</div>
                        </div>
                        <div v-if="selectedMaterial.accounting_type === 2">
                            <span class="text-sm text-gray-600">Партия/номинал (type=2):</span>
                            <div class="font-semibold">{{ selectedMaterial.type2_quantity_param }}</div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Из:</span>
                            <div class="font-semibold">{{ selectedMaterial.last_from_object_name || '—' }}</div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">В:</span>
                            <div class="font-semibold">{{ selectedMaterial.last_to_object_name || '—' }}</div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Текущее количество:</span>
                            <div class="font-semibold text-green-600 text-lg">
                                {{ selectedMaterial.quantity_current.toFixed(3) }}
                            </div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Последняя операция:</span>
                            <div class="font-semibold">{{ selectedMaterial.last_operation_name }}</div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Дата последней операции:</span>
                            <div class="font-semibold">
                                {{ new Date(selectedMaterial.last_operation_date).toLocaleDateString('ru-RU') }}
                            </div>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Объект:</span>
                            <div class="font-semibold">{{ selectedMaterial.object_name || 'Не указан' }}</div>
                        </div>
                    </div>
                </div>

                <!-- График изменения количества -->
                <div class="bg-white border rounded-lg p-4">
                    <h3 class="text-lg font-semibold mb-4">График изменения количества</h3>
                    <div class="h-[300px]">
                        <Chart 
                            type="line" 
                            :data="materialChartData" 
                            :options="materialChartOptions" 
                            class="h-full"
                        />
                    </div>
                </div>

                <!-- Таблица всех операций по материалу -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">
                        Все операции ({{ materialOperations.length }})
                    </h3>
                    <DataTable 
                        :value="materialOperations" 
                        scrollable 
                        scrollHeight="400px"
                        :rows="20"
                        :paginator="materialOperations.length > 20"
                        :rows-per-page-options="[20, 50, 100]"
                    >
                        <Column field="operation_id" header="ID операции" sortable />
                        <Column field="operation_date" header="Дата" sortable>
                            <template #body="slotProps">
                                {{ new Date(slotProps.data.operation_date).toLocaleDateString('ru-RU') }}
                            </template>
                        </Column>
                        <Column field="operation_name" header="Операция" sortable />
                        <Column field="from_object_name" header="Из" sortable />
                        <Column field="to_object_name" header="В" sortable />
                        <Column field="move_quantity_total" header="Перемещено" sortable>
                            <template #body="slotProps">
                                <span :class="parseFloat(slotProps.data.move_quantity_total || '0') >= 0 ? 'text-green-600' : 'text-red-600'">
                                    {{ parseFloat(String(slotProps.data.move_quantity_total ?? '0')).toFixed(3) }}
                                </span>
                            </template>
                        </Column>
                        <Column field="quantity_after_total" header="Количество после" sortable>
                            <template #body="slotProps">
                                <span class="font-semibold">
                                    {{ parseFloat(String(slotProps.data.quantity_after_total ?? '0')).toFixed(3) }}
                                </span>
                            </template>
                        </Column>
                        <Column field="object_name" header="Объект" sortable />
                        <Column field="accounting_type" header="Тип учета" sortable />
                    </DataTable>
                </div>
            </div>
        </Drawer>
    </div>

</template>

<style scoped>
:deep(.p-tabs .p-tablist) {
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    width: auto !important;
    max-width: 100% !important;
}

:deep(.p-tabs .p-tab) {
    flex-shrink: 0 !important;
    width: auto !important;
    min-width: fit-content !important;
    white-space: nowrap !important;
}
</style>