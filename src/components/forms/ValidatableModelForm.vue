<script setup lang="ts" generic="T extends IValidatable">
import type { IValidatable } from '@/decorators/validation';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { computed, ref } from 'vue';
import { keyBy } from 'lodash';

const emit = defineEmits<{
    (e: 'submit', model: T): void;
    (e: 'cancel'): void;
}>();

const model = defineModel<T>('model', { required: true });
const submitted = ref(false);

const handleSubmit = () => {
    submitted.value = true;
    
    // Если есть ошибки валидации - не отправляем форму
    if (!model.value.isValid()) {
        return;
    }
    
    emit('submit', model.value);
};

const handleCancel = () => {
    submitted.value = false;
    emit('cancel');
};

const errors = computed(() => {
    // Показываем ошибки только после попытки отправки
    if (!submitted.value) {
        return {};
    }
    
    return keyBy(model.value.validationErrors(), 'property');
});

</script>

<template>
    <div>
        <slot :model="model" :errors="errors" />
        <Divider />
        <div class="flex gap-2 justify-end">
            <Button severity="secondary" label="Отмена" @click="handleCancel" />
            <Button label="Сохранить" @click="handleSubmit" />
        </div>
    </div>
</template>
