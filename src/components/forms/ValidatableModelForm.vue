<script setup lang="ts" generic="T extends IValidatable">
import type { IValidatable } from '@/decorators/validation';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { computed, ref } from 'vue';
import { keyBy } from 'lodash';
import { DEFAULT_CANCEL_BUTTON_PROPS, DEFAULT_SAVE_BUTTON_PROPS } from '@/constants';
import { useToastMessage } from '@/composables/useToastMessage';
import { useConfirmMessage } from '@/composables/useConfirmMessage';

const emit = defineEmits<{
    (e: 'submit', model: T): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<T>('model', { required: true });
const loading = defineModel<boolean>('loading', { required: true });
const props = withDefaults(defineProps<{
    onConfirmEmptyAccept?: (payload: { model: T, justification?: string, fields: { name: string, label: string }[] }) => Promise<void> | void;
    hideButtons?: boolean;
    validationVersion?: number;
}>(), {
    hideButtons: false,
    validationVersion: 0,
});
const submitted = ref(false);

const { addWarnMessage } = useToastMessage();
const { confirmEmptyFields } = useConfirmMessage();

const isEmptyValue = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value?.isEmpty === 'function') return value.isEmpty();
    if (typeof value?.count === 'function') return value.count() === 0;
    return false;
};

const submit = async (): Promise<boolean> => {
    submitted.value = true;

    if (!model.value.isValid()) {
        addWarnMessage('Ошибки валидации формы');
        return false;
    }
    const fieldsMeta: Record<string, any> = (model.value as any).fields || {};
    const emptyConfirmables = Object.keys(fieldsMeta)
        .filter(name => fieldsMeta[name]?.confirmIfEmpty === true)
        .filter(name => isEmptyValue((model.value as any)[name]));

    if (emptyConfirmables.length > 0) {
        const requireJustification = emptyConfirmables.some(name => !!fieldsMeta[name]?.shouldJustifyEmptyFields);
        const fields = emptyConfirmables.map(name => ({ name, label: fieldsMeta[name]?.label || name }));
        let accepted = false;
        await confirmEmptyFields({
            fields,
            requireJustification,
            accept: async ({ justification }) => {
                if (props.onConfirmEmptyAccept) {
                    await props.onConfirmEmptyAccept({ model: model.value, justification, fields });
                }
                emit('submit', model.value);
                accepted = true;
            },
            reject: async () => { }
        });
        return accepted;
    }

    emit('submit', model.value);
    return true;
};

const handleSubmit = async () => {
    return await submit();
};

const handleCancel = () => {
    submitted.value = false;
    emit('cancel');
};

const errors = computed(() => {
    if (!submitted.value) return {};
    return keyBy(model.value.validationErrors(), 'property');
});

const isValidForm = computed(() => {
    // Связываем с версией изменений формы, чтобы обеспечить реактивность наверх
    void props.validationVersion;
    return model.value.isValid();
});

const getIsValidForm = () => {
  void props.validationVersion;
  return model.value.isValid();
};

defineExpose({
    submit,
    handleSubmit,
    cancel: handleCancel,
    handleCancel,
    isValidForm,
    getIsValidForm,
});

</script>

<template>
    <form @submit.prevent="handleSubmit">
        <slot :model="model" :errors="errors" :touched="submitted" />
        <Divider />
        <div class="flex gap-2 justify-end">
            <Button v-bind="DEFAULT_CANCEL_BUTTON_PROPS" type="button" @click="handleCancel" :disabled="loading"
                v-if="!hideButtons" />
            <Button v-bind="DEFAULT_SAVE_BUTTON_PROPS" type="submit" :disabled="loading" v-if="!hideButtons" />
        </div>
    </form>
</template>
