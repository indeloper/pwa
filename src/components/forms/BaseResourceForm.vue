<script setup lang="ts">
import ValidatableModelForm from './ValidatableModelForm.vue';
import ValidatableModelField from './ValidatableModelField.vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import ToggleSwitch from 'primevue/toggleswitch';
const emit = defineEmits<{
    (e: 'submit', model: any): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<any>('model', { required: true });
const loading = defineModel<boolean>('loading', { required: true });

const handleSubmit = () => {
    emit('submit', model.value);
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <ValidatableModelForm v-model:model="model" :loading="loading" @submit="handleSubmit" @cancel="handleCancel">
        <template #default="{ model, errors, touched }">
            <div class="flex flex-col gap-4">
                <template v-for="(field, name) in model.fields" :key="field.name">
                    <ValidatableModelField :model="model" :label="field.label" :property="String(name)"
                        :touched="touched">
                        <template v-if="field.type === 'text'">
                            <InputText v-model="model![name]" :placeholder="field.placeholder || field.label || ''"
                                fluid :disabled="loading" :required="field.required" />
                        </template>
                        <template v-if="field.type === 'number'">
                            <InputNumber v-model="model![name]" :placeholder="field.placeholder || field.label || ''"
                                fluid :disabled="loading" :required="field.required" />
                        </template>
                        <template v-if="field.type === 'textarea'">
                            <Textarea v-model="model![name]" :placeholder="field.placeholder || field.label || ''" fluid
                                :disabled="loading" :required="field.required" rows="3" />
                        </template>
                        <template v-if="field.type === 'longtext'">
                            <Textarea v-model="model![name]" :placeholder="field.placeholder || field.label || ''" fluid
                                :disabled="loading" :required="field.required" rows="6" />
                        </template>
                        <template v-if="field.type === 'select'">
                            <Select v-model="model![name]" :placeholder="field.placeholder || field.label || ''" fluid
                                :disabled="loading" :required="field.required"
                                :options="model.getFieldOption(name, 'options')" option-value="value"
                                option-label="label" />
                        </template>
                        <template v-if="field.type === 'boolean'">
                            <ToggleSwitch class="my-2" v-model="model![name]" fluid :disabled="loading" :required="field.required" />
                        </template>
                    </ValidatableModelField>
                </template>
            </div>
        </template>
    </ValidatableModelForm>
</template>