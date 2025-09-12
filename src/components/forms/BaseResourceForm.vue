<script setup lang="ts">
import ValidatableModelForm from './ValidatableModelForm.vue';
import ValidatableModelField from './ValidatableModelField.vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import ToggleSwitch from 'primevue/toggleswitch';
import MultiSelect from 'primevue/multiselect';
import { computed, ref, watch } from 'vue';
import DatePicker from 'primevue/datepicker';
/** @ts-ignore */
import { FileUploader } from '@ui';

const emit = defineEmits<{
    (e: 'submit', model: any): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<any>('model', { required: true });
const loading = defineModel<boolean>('loading', { required: true });

const props = withDefaults(defineProps<{
    columns?: number;
    only?: string[] | undefined;
    exclude?: string[] | undefined;
    hideButtons?: boolean;
}>(), {
    columns: 1,
    only: undefined,
    exclude: undefined,
});

const validatableModelFormRef = ref();
const validationVersion = ref(0);

watch(model, () => {
    validationVersion.value++;
}, { deep: true });

const visibleFieldNames = computed<string[]>(() => {
    const fields = model.value?.fields ?? {};
    const allNames = Object.keys(fields);
    let names = allNames;

    if (props.only && props.only.length > 0) {
        names = props.only.filter(name => allNames.includes(name));
    }

    if (props.exclude && props.exclude.length > 0) {
        names = names.filter(name => !props.exclude!.includes(name));
    }

    return names;
});

const displayedFields = computed(() => {
    const fields = model.value?.fields ?? {} as Record<string, any>;
    return visibleFieldNames.value
        .map(name => ({ name, field: fields[name] }))
        .filter(item => !!item.field);
});

const isValidForm = computed(() => validatableModelFormRef.value?.getIsValidForm?.() ?? false);

const getColSpan = (field: any): number => {
    if (!field) return 1;
    if (field.type === 'textarea' || field.type === 'longtext' || field.type === 'files' || field.type === 'file') return props.columns;
    return 1;
}

const handleSubmit = () => {
    emit('submit', model.value);
};

const handleCancel = () => {
    emit('cancel');
};

const submit = async (): Promise<boolean> => {
    const api = validatableModelFormRef.value as any;
    if (api && typeof api.submit === 'function') {
        return await api.submit();
    }
    return false;
};

const cancel = () => {
    const api = validatableModelFormRef.value as any;
    if (api && typeof api.cancel === 'function') {
        api.cancel();
    }
};

defineExpose({
    submit,
    handleSubmit,
    cancel,
    handleCancel,
    isValidForm,
});
</script>

<template>
    <ValidatableModelForm ref="validatableModelFormRef" v-model:model="model" :loading="loading" @submit="handleSubmit" @cancel="handleCancel" :hide-buttons="props.hideButtons" :validation-version="validationVersion">
        <template #default="{ model, touched }">
            <div class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` }">
                <template v-for="item in displayedFields" :key="item.name">
                    <div :class="`col-span-${getColSpan(item.field)}`">
                        <ValidatableModelField :model="model" :label="item.field.label" :property="String(item.name)"
                            :touched="touched">
                            <template v-if="item.field.type === 'text'">
                                <InputText v-model="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :required="item.field.required" />
                            </template>
                            <template v-if="item.field.type === 'number'">
                                <InputNumber v-model="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :required="item.field.required" />
                            </template>
                            <template v-if="item.field.type === 'textarea'">
                                <Textarea v-model="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :required="item.field.required" rows="3" />
                            </template>
                            <template v-if="item.field.type === 'longtext'">
                                <Textarea v-model="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :required="item.field.required" rows="6" />
                            </template>
                            <template v-if="item.field.type === 'select'">
                                <Select v-model="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :required="item.field.required"
                                    :options="model.getFieldOption(item.name, 'options')" option-value="value"
                                    option-label="label" filter />
                            </template>
                            <template v-if="item.field.type === 'multiselect'">
                                <MultiSelect v-model="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :required="item.field.required"
                                    :options="model.getFieldOption(item.name, 'options')" option-value="value"
                                    option-label="label" filter />
                            </template>
                            <template v-if="item.field.type === 'boolean'">
                                <ToggleSwitch class="my-2" v-model="model![item.name]" fluid :disabled="loading"
                                    :required="item.field.required" />
                            </template>
                            <template v-if="item.field.type === 'date'">
                                <DatePicker v-model="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :required="item.field.required" />
                            </template>

                            <!-- Файлы: множественные -->
                            <template v-if="item.field.type === 'files' || (item.field.type === 'file' && item.field.multiple)">
                                <FileUploader v-model:collection="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :accept="item.field.accept"
                                    :show-preview="item.field.showPreview" :multiple="true" />
                            </template>

                            <!-- Файл: одиночный -->
                            <template v-else-if="item.field.type === 'file' && !item.field.multiple">
                                <FileUploader v-model:model="model![item.name]"
                                    :placeholder="item.field.placeholder || item.field.label || ''" fluid
                                    :disabled="loading" :accept="item.field.accept"
                                    :show-preview="item.field.showPreview" :multiple="false" />
                            </template>
                        </ValidatableModelField>
                    </div>
                </template>
            </div>
        </template>

    </ValidatableModelForm>

    <!-- ConfirmDialog вынесен глобально в App.vue -->
</template>