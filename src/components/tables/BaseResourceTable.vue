<script setup lang="ts">
import { isMobile } from '@/helpers';
import { computed, ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import MultiSelect from 'primevue/multiselect';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import type BaseResourceCollection from '@/models/BaseResourceCollection';
import type { FilterSettings } from '@/types/table';
import { FilterMatchMode } from '@primevue/core/api';
import _ from 'lodash';
import { Plus } from '@vicons/fa';

const props = defineProps<{
    models: BaseResourceCollection<any>;
    title?: string;
    showMassDelete?: boolean;
    startMassDelete?: (models: any[]) => void;
    startAdd?: () => void;
    startEdit?: (model: any) => void;
    startDelete?: (model: any) => void;
}>();

const modelsArray = ref<any[]>([]);
const selectedModels = ref<any[]>([]);

const filteredModelsArray = computed<any[]>(() => {

    return modelsArray.value;

    if (!globalSearchString.value || globalSearchString.value.trim() === '') {
        return modelsArray.value;
    }

    const searchTerm = globalSearchString.value.toLowerCase().trim();
    const textFields = getGlobalFilterFields();

    return modelsArray.value.filter(item => {
        // Если есть текстовые поля, ищем только по ним
        if (textFields.length > 0) {
            return textFields.some(fieldName => {
                const fieldValue = getFieldValueForSearch(item, fieldName);
                if (!fieldValue) return false;

                const stringValue = fieldValue.toString().toLowerCase();
                return stringValue.includes(searchTerm);
            });
        }

        // Если текстовых полей нет, ищем по всем полям
        return Object.keys(columns.value).some(fieldName => {
            const fieldValue = getFieldValueForSearch(item, fieldName);
            if (!fieldValue) return false;

            const stringValue = fieldValue.toString().toLowerCase();
            return stringValue.includes(searchTerm);
        });
    });
});

const columnsInitialazed = computed<boolean>(() => {
    return props.models.first()?.fields !== undefined;
});

const columns = computed<Record<string, any>>(() => {
    return props.models.first()?.fields || {};
});

const filters = ref<Record<string, FilterSettings>>({});
const globalSearchString = ref<string>('');

// Для диалога длинного текста
const longtextDialogVisible = ref(false);
const longtextDialogTitle = ref('');
const longtextDialogContent = ref('');

const initFilters = () => {
    filters.value['global'] = { value: null, matchMode: FilterMatchMode.STARTS_WITH };

    Object.keys(props.models.first()?.fields).forEach((key: string) => {
        const fieldType = props.models.first()?.fields[key].type;
        console.log(fieldType);

        let matchMode = FilterMatchMode.STARTS_WITH;

        // Определяем matchMode в зависимости от типа поля
        switch (fieldType) {
            case 'number':
            case 'integer':
            case 'decimal':
            case 'float':
                matchMode = FilterMatchMode.EQUALS;
                break;
            case 'boolean':
                matchMode = FilterMatchMode.EQUALS;
                break;
            case 'date':
            case 'datetime':
                matchMode = FilterMatchMode.DATE_IS;
                break;
            case 'select':
                matchMode = FilterMatchMode.EQUALS;
                break;
            case 'multiselect':
                matchMode = FilterMatchMode.CUSTOM;
                break;
            case 'longtext':
            case 'textarea':
                matchMode = FilterMatchMode.CONTAINS;
                break;
            case 'text':
            case 'string':
            default:
                matchMode = FilterMatchMode.STARTS_WITH;
                break;
        }

        filters.value[key] = { value: null, matchMode: matchMode };
    });
}

const getFilterOptions = (fieldName: string) => {
    const model = props.models.first();
    if (!model) return [];

    // Сначала пытаемся получить опции из метаданных модели
    if (typeof model.getFieldOption === 'function') {
        const metaOptions = model.getFieldOption(fieldName, 'options');
        if (Array.isArray(metaOptions)) {
            return metaOptions.map((opt: any) => {
                const isPrimitive = opt === null || ['string', 'number', 'boolean'].includes(typeof opt);
                const value = isPrimitive ? opt : (opt.value ?? opt.id ?? opt.key ?? opt);
                const label = isPrimitive ? String(opt ?? '') : (opt.label ?? String(value ?? ''));
                return { label: String(label ?? ''), value };
            });
        }
    }

    // Если у колонки определён метод options(), используем его
    const col = columns.value[fieldName];
    if (col && typeof col.options === 'function') {
        const opts = col.options();
        if (Array.isArray(opts)) {
            return opts.map((opt: any) => {
                const isPrimitive = opt === null || ['string', 'number', 'boolean'].includes(typeof opt);
                const value = isPrimitive ? opt : (opt.value ?? opt.id ?? opt.key ?? opt);
                const label = isPrimitive ? String(opt ?? '') : (opt.label ?? String(value ?? ''));
                return { label: String(label ?? ''), value };
            });
        }
    }

    // Итоговый fallback: собрать уникальные значения из данных
    const values = _.uniq(
        props.models.toArray()
            .map((m: any) => m[fieldName])
            .flat()
    ).filter((v: any) => v !== null && v !== undefined && v !== '');

    return values.map((value: any) => ({
        label: String(value ?? ''),
        value
    }));
}

// Кастомная функция фильтра для полей, где значение в строке может быть массивом (multiselect)
const arrayIntersects = (cellValue: any, filterValue: any): boolean => {
    const selected = Array.isArray(filterValue)
        ? filterValue
        : (filterValue !== null && filterValue !== undefined)
            ? [filterValue]
            : [];

    // Пустой фильтр ничего не отфильтровывает
    if (selected.length === 0) return true;

    const cell = Array.isArray(cellValue)
        ? cellValue
        : (cellValue !== null && cellValue !== undefined)
            ? [cellValue]
            : [];

    // Совпадение по хотя бы одному значению
    return selected.some((v) => cell.includes(v));
}

const getColumnDataType = (fieldType: string): string => {
    switch (fieldType) {
        case 'number':
        case 'integer':
            return 'numeric';
        case 'decimal':
        case 'float':
            return 'numeric';
        case 'boolean':
            return 'boolean';
        case 'date':
            return 'date';
        case 'datetime':
            return 'date';
        case 'select':
            return 'text'; // Select options are typically strings
        case 'multiselect':
            return 'text'; // MultiSelect values can be arrays, but we treat as text for sorting
        case 'text':
        case 'string':
            return 'text';
        case 'longtext':
        case 'textarea':
            return 'text';
        default:
            return 'text';
    }
}

const getGlobalFilterFields = (): string[] => {
    return Object.keys(columns.value).filter(fieldName => {
        const fieldType = columns.value[fieldName].type;
        return ['text', 'string', 'longtext', 'textarea'].includes(fieldType);
    });
}

const getMobileDisplayValue = (data: any): string => {
    const textFields = getGlobalFilterFields();
    if (textFields.length === 0) return JSON.stringify(data);

    // Собираем значения из всех текстовых полей
    const values = textFields.map(fieldName => {
        const value = data[fieldName];
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        return value?.toString() || '';
    }).filter(val => val.trim() !== '');

    return values.join(' | ');
}

const getFieldValueForSearch = (data: any, fieldName: string): string => {
    const value = data[fieldName];
    const column = columns.value[fieldName];

    if (value === null || value === undefined) return '';

    // Сначала пробуем использовать column.displayValue если он есть
    if (column?.displayValue && typeof column.displayValue === 'function') {
        const displayValue = column.displayValue(value);
        if (displayValue && displayValue !== '-') {
            return displayValue;
        }
    }

    // Если у модели есть метод getFieldDisplayValue, используем его для получения отображаемого значения
    if (typeof data.getFieldDisplayValue === 'function') {
        const displayValue = data.getFieldDisplayValue(fieldName, value);
        if (displayValue && displayValue !== '-') {
            return displayValue;
        }
    }

    // Для массивов (multiselect) объединяем значения
    if (Array.isArray(value)) {
        return value.join(' ');
    }

    // Для остальных типов возвращаем строковое представление
    return value.toString();
}

const getFieldDisplayValue = (data: any, fieldName: string, column: any): string => {
    const value = data[fieldName];

    if (value === null || value === undefined) return '';

    // Сначала пробуем использовать column.displayValue если он есть
    if (column.displayValue && typeof column.displayValue === 'function') {
        return column.displayValue(value);
    }

    // Если у модели есть метод getFieldDisplayValue, используем его
    if (typeof data.getFieldDisplayValue === 'function') {
        return data.getFieldDisplayValue(fieldName, value);
    }

    // Иначе форматируем в зависимости от типа
    switch (column.type) {
        case 'boolean':
            return value === true ? 'Да' : value === false ? 'Нет' : '-';
        case 'number':
        case 'integer':
            return value.toString();
        case 'decimal':
        case 'float':
            return Number(value).toFixed(2);
        case 'date':
            return new Date(value).toLocaleDateString('ru-RU');
        case 'datetime':
            return new Date(value).toLocaleString('ru-RU');
        case 'multiselect':
            return Array.isArray(value) ? value.join(', ') : value?.toString() || '-';
        default:
            return value?.toString() || '-';
    }
}

const showLongtextDialog = (title: string, content: string) => {
    longtextDialogTitle.value = title;
    longtextDialogContent.value = content;
    longtextDialogVisible.value = true;
}

const hideLongtextDialog = () => {
    longtextDialogVisible.value = false;
}

const handleMassDelete = () => {
    props.startMassDelete?.(selectedModels.value);
}

const handleStartAdd = () => {
    props.startAdd?.();
}

const handleStartEdit = (model: any) => {
    props.startEdit?.(model);
}

const handleStartDelete = (model: any) => {
    props.startDelete?.(model);
}

// Инициализация и обновление данных
const initializeData = () => {
    initFilters();
    console.log(columns.value);
    modelsArray.value = props.models.toArray();
}

// Следим за инициализацией колонок
watch(columnsInitialazed, () => {
    if (columnsInitialazed.value) {
        initializeData();
    }
});

// Следим за изменениями в props.models
watch(() => props.models, () => {
    modelsArray.value = props.models.toArray();
}, { deep: true });
</script>

<template>
{{  filters  }}
    <DataTable :value="filteredModelsArray" size="small" filterDisplay="row" v-model:filters="filters" dataKey="uuid" row-hover>

        <template #header>
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">{{ title ?? 'Список' }}</h1>
                <div class="flex gap-2">
                    <template v-if="showMassDelete && selectedModels.length > 0">
                        <Button icon="pi pi-trash" label="Удалить выбранные" @click="handleMassDelete" />
                    </template>
                    <template v-if="startAdd">
                        <Button @click="handleStartAdd" size="small">
                            <Plus class="w-4 h-4" />
                            <p class="hidden md:block">Добавить</p>
                        </Button>
                    </template>
                </div>
            </div>
        </template>

        <!-- Десктопная версия -->
        <template v-if="!isMobile()">
            <Column v-for="(column, name) in columns" :key="name" :field="name" :header="column.label"
                :dataType="getColumnDataType(column.type)" :sortable="column.sortable ?? true"
                :style="column.style || ''" :class="column.class || ''" :frozen="column.frozen ?? false"
                :filterFunction="column.type === 'multiselect' ? arrayIntersects : undefined">
                <template #filter="{ filterModel, filterCallback }">
                    <!-- Числовые типы -->
                    <template v-if="column.type === 'number' || column.type === 'integer'">
                        <InputNumber v-model="filterModel.value" size="small" fluid placeholder="Поиск по числу"
                            @input="filterCallback()" />
                    </template>

                    <!-- Десятичные числа -->
                    <template v-else-if="column.type === 'decimal' || column.type === 'float'">
                        <InputNumber v-model="filterModel.value" size="small" fluid :minFractionDigits="2"
                            :maxFractionDigits="2" placeholder="Поиск по числу" @input="filterCallback()" />
                    </template>

                    <!-- Логический тип -->
                    <template v-else-if="column.type === 'boolean'">
                        <Select v-model="filterModel.value" size="small" fluid placeholder="Все" :options="[
                            { label: 'Все', value: null },
                            { label: 'Да', value: true },
                            { label: 'Нет', value: false }
                        ]" option-label="label" option-value="value" @change="filterCallback()" />
                    </template>

                    <!-- Дата -->
                    <template v-else-if="column.type === 'date'">
                        <input v-model="filterModel.value" type="date" class="p-inputtext p-inputtext-sm p-fluid"
                            @change="filterCallback()" />
                    </template>

                    <!-- Дата и время -->
                    <template v-else-if="column.type === 'datetime'">
                        <input v-model="filterModel.value" type="datetime-local"
                            class="p-inputtext p-inputtext-sm p-fluid" @change="filterCallback()" />
                    </template>

                    <!-- Select с опциями -->
                    <template v-else-if="column.type === 'select'">
                        <Select v-model="filterModel.value" size="small" fluid placeholder="Все" :options="[
                            { label: 'Все', value: null },
                            ...getFilterOptions(name)
                        ]" option-label="label" option-value="value" @change="filterCallback()" />
                    </template>

                    <!-- MultiSelect с опциями -->
                    <template v-else-if="column.type === 'multiselect'">
                        <MultiSelect v-model="filterModel.value" size="small" fluid placeholder="Все"
                            :options="getFilterOptions(name)" option-label="label" option-value="value"
                            @change="filterCallback()" />
                    </template>

                    <!-- Текстовые поля -->
                    <template v-else-if="column.type === 'longtext' || column.type === 'textarea'">
                        <InputText v-model="filterModel.value" size="small" fluid type="text" placeholder="Поиск..."
                            @input="filterCallback()" />
                    </template>

                    <!-- Обычный текст -->
                    <template v-else-if="column.type === 'text' || column.type === 'string'">
                        <InputText v-model="filterModel.value" size="small" fluid type="text" placeholder="Поиск..."
                            @input="filterCallback()" />
                    </template>

                    <!-- По умолчанию -->
                    <template v-else>
                        <InputText v-model="filterModel.value" size="small" fluid type="text" placeholder="Поиск..."
                            @input="filterCallback()" />
                    </template>
                </template>
                <template #body="{ data }">
                    <!-- Используем единую функцию для отображения -->
                    <template v-if="column.type === 'longtext' && data[name]">
                        <Button size="small" text @click="showLongtextDialog(column.label, data[name])"
                            icon="pi pi-eye" />
                    </template>
                    <template v-else>
                        {{  data[name]  }}
                        {{ getFieldDisplayValue(data, name, column) }}
                    </template>
                </template>
            </Column>
            <Column class="w-[10%]">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button v-if="startEdit" size="small" text @click="handleStartEdit(data)" icon="pi pi-pencil" />
                        <Button v-if="startDelete" severity="danger" size="small" text @click="handleStartDelete(data)"
                            icon="pi pi-trash" />
                    </div>
                </template>
            </Column>
        </template>

        <!-- Мобильная версия -->
        <template v-else>
            <Column>
                <template #filter>
                    <InputText v-model="globalSearchString" fluid placeholder="Поиск..." />
                </template>
                <template #body="{ data }">
                    <div class="flex flex-col gap-2">
                        <div v-for="(column, name, index) in columns" :key="name">
                            <template v-if="column.showOnMobileSummary || index === 0">
                                <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                    <p class="font-bold text-lg">{{ getFieldDisplayValue(data, name, column) }}</p>
                                    <div class="flex gap-2">
                                        <Button v-if="startEdit" size="small" text @click="handleStartEdit(data)"
                                            icon="pi pi-pencil" />
                                        <Button v-if="startDelete" severity="danger" size="small" text
                                            @click="handleStartDelete(data)" icon="pi pi-trash" />
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="flex flex-col last:border-b-0 border-b border-gray-200 pb-2 px-2">
                                    <p class="font-medium text-gray-500 text-sm">{{ column.label }}</p>
                                    <template v-if="column.type === 'longtext' && data[name]">
                                        <Button size="small" text @click="showLongtextDialog(column.label, data[name])"
                                            icon="pi pi-eye" />
                                    </template>
                                    <template v-else>
                                        <p class="font-bold">{{ getFieldDisplayValue(data, name, column) }}</p>
                                    </template>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </Column>
        </template>
    </DataTable>

    <!-- Модальное окно для отображения longtext -->
    <Dialog v-model:visible="longtextDialogVisible" :header="longtextDialogTitle" modal class="w-[90vw] md:w-[50vw]">
        <div class="whitespace-pre-wrap">{{ longtextDialogContent }}</div>
        <template #footer>
            <Button label="Закрыть" @click="hideLongtextDialog" />
        </template>
    </Dialog>
</template>

<style scoped>
/* Мобильные стили уже встроены в Tailwind классы */
</style>