<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import AppFile from '@/models/File';
import FileCollection from '@/models/collections/FileCollection';
import Dialog from 'primevue/dialog';

// Emits
const emit = defineEmits(['change', 'add', 'remove', 'error']);

// v-models: либо одиночная модель файла, либо коллекция
const model = defineModel<AppFile | null>('model');
const collection = defineModel<FileCollection | null>('collection');

const props = withDefaults(defineProps<{
    multiple?: boolean;
    accept?: string | undefined; // e.g. "image/*,.pdf"
    maxSizeMb?: number | undefined;
    maxFiles?: number | undefined; // only relevant for multiple
    withComment?: boolean; // отображать поле комментария для файла
    placeholder?: string;
    disabled?: boolean;
    showPreview?: boolean;
}>(), {
    multiple: false,
    accept: undefined,
    maxSizeMb: undefined,
    maxFiles: undefined,
    withComment: false,
    placeholder: 'Перетащите файлы сюда или нажмите, чтобы выбрать',
    disabled: false,
    showPreview: true,
});

// Для реактивации списка при мутирующих действиях
const version = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

// Если в single-режиме передали коллекцию — считаем multiple=true
const isMultiple = computed<boolean>(() => props.multiple || !!collection.value);

// Список файлов для отображения
const filesList = computed<AppFile[]>(() => {
    // зависимость для форс-обновления
    version.value;
    if (collection.value) {
        return collection.value.toArray() as AppFile[];
    }
    return model.value ? [model.value] : [];
});

const isSingleWithFile = computed<boolean>(() => !isMultiple.value && filesList.value.length === 1);

// Helpers
const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const matchesAccept = (file: globalThis.File, accept?: string): boolean => {
    if (!accept) return true;
    const rules = accept.split(',').map(r => r.trim()).filter(Boolean);
    if (rules.length === 0) return true;
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    for (const rule of rules) {
        if (rule.startsWith('.')) {
            if (ext === rule.toLowerCase()) return true;
            continue;
        }
        if (rule.includes('/*')) {
            const typeRoot = rule.split('/')[0];
            if (file.type.startsWith(typeRoot + '/')) return true;
            continue;
        }
        if (rule.includes('/')) {
            if (file.type.toLowerCase() === rule.toLowerCase()) return true;
            continue;
        }
    }
    return false;
};

const readFileAsBase64 = (nativeFile: globalThis.File): Promise<{ base64: string, type: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve({ base64, type: nativeFile.type || 'application/octet-stream' });
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(nativeFile);
    });
};

const buildAppFile = async (nativeFile: globalThis.File): Promise<AppFile | null> => {
    if (props.maxSizeMb && nativeFile.size > props.maxSizeMb * 1024 * 1024) {
        emit('error', `Файл ${nativeFile.name} превышает лимит ${props.maxSizeMb} MB`);
        return null;
    }
    if (!matchesAccept(nativeFile, props.accept)) {
        emit('error', `Файл ${nativeFile.name} не соответствует формату (${props.accept || 'любой'})`);
        return null;
    }
    const { base64, type } = await readFileAsBase64(nativeFile);
    const file = new AppFile();
    file.name = nativeFile.name;
    file.type = type;
    file.size = nativeFile.size;
    file.base64 = base64;
    return file;
};

// Добавление файлов
const addNativeFiles = async (list: FileList | globalThis.File[]): Promise<void> => {
    const array = Array.from(list);
    const built = (await Promise.all(array.map(buildAppFile))).filter((f): f is AppFile => !!f);
    if (built.length === 0) return;

    if (isMultiple.value) {
        const current = collection.value ? collection.value.toArray() as AppFile[] : [];
        const merged = [...current, ...built];
        if (props.maxFiles && merged.length > props.maxFiles) {
            emit('error', `Превышено максимальное количество файлов (${props.maxFiles})`);
            return;
        }
        collection.value = new FileCollection(merged);
    } else {
        // single mode: берём первый
        model.value = built[0] || null;
    }
    version.value++;
    emit('change', { model: model.value, collection: collection.value });
    built.forEach(f => emit('add', f));
};

const removeFile = (file: AppFile, index: number): void => {
    if (isMultiple.value) {
        const current = collection.value ? collection.value.toArray() as AppFile[] : [];
        const next = current.filter((_, i) => i !== index);
        collection.value = new FileCollection(next);
    } else {
        model.value = null;
    }
    version.value++;
    emit('change', { model: model.value, collection: collection.value });
    emit('remove', file);
};

const clearAll = (): void => {
    if (isMultiple.value) {
        collection.value = new FileCollection([]);
    } else {
        model.value = null;
    }
    version.value++;
    emit('change', { model: model.value, collection: collection.value });
};

const openFileDialog = () => {
    if (props.disabled) return;
    fileInput.value?.click();
};

const onFileInputChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    await addNativeFiles(target.files);
    // очистить, чтобы выбор того же файла повторно вызывал change
    target.value = '';
};

const onDrop = async (e: DragEvent) => {
    if (props.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging.value = false;
    if (!e.dataTransfer) return;
    const list = e.dataTransfer.files;
    await addNativeFiles(list);
};

const onDragOver = (e: DragEvent) => {
    if (props.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging.value = true;
};

const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.value = false;
};

// Превью data URL
const fileDataUrl = (file: AppFile): string => `data:${file.type};base64,${file.base64}`;

// Комментарии (опционально). Будем хранить прямо в объекте, используя расширение типа.
interface FileWithComment extends AppFile { comment?: string }

// Иконки по типу/расширению (плейсхолдеры, пользователь подставит компоненты позже)
const fileIconsByKind: Record<string, string> = {
    pdf: 'icon-pdf',
    image: 'icon-image',
    video: 'icon-video',
    audio: 'icon-audio',
    doc: 'icon-doc',
    xls: 'icon-xls',
    ppt: 'icon-ppt',
    zip: 'icon-zip',
    txt: 'icon-txt',
    code: 'icon-code',
    default: 'icon-file',
};

const getFileKind = (file: AppFile): string => {
    const type = (file.type || '').toLowerCase();
    const name = (file.name || '').toLowerCase();
    const ext = name.includes('.') ? name.split('.').pop() as string : '';
    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf' || ext === 'pdf') return 'pdf';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) return 'doc';
    if (['xls', 'xlsx', 'ods', 'csv'].includes(ext)) return 'xls';
    if (['ppt', 'pptx', 'odp'].includes(ext)) return 'ppt';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'zip';
    if (['txt', 'md', 'log'].includes(ext)) return 'txt';
    if (['js', 'ts', 'json', 'xml', 'yml', 'yaml', 'html', 'css', 'scss'].includes(ext)) return 'code';
    return 'default';
};

const getIconForFile = (file: AppFile): string => fileIconsByKind[getFileKind(file)] || fileIconsByKind.default;

// Просмотр в модальном окне (для изображений и PDF)
const previewVisible = ref(false);
const previewFile = ref<AppFile | null>(null);
const openPreview = (file: AppFile) => {
    const kind = getFileKind(file);
    if (kind === 'image' || kind === 'pdf') {
        previewFile.value = file;
        previewVisible.value = true;
    }
};

</script>

<template>
    <div class="flex flex-col gap-4">
        <input ref="fileInput" type="file" class="hidden"
               :accept="accept" :multiple="isMultiple" :disabled="disabled"
               @change="onFileInputChange" />

        <!-- Область загрузки, совмещённая со списком превью -->
        <div
            class="rounded-md border-2 border-dashed bg-white"
            :class="[
                'p-3',
                disabled ? 'opacity-60 cursor-not-allowed' : isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            ]"
            @click="isSingleWithFile ? undefined : openFileDialog()"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
        >
            <!-- Single mode с файлом: показываем единственную карточку в этой области -->
            <template v-if="isSingleWithFile">
                <div class="flex items-center justify-between mb-2">
                    <div class="text-xs text-gray-500 flex gap-2">
                        <span v-if="accept">Разрешено: {{ accept }}</span>
                        <span v-if="maxSizeMb">Лимит: {{ maxSizeMb }} MB</span>
                    </div>
                    <div class="flex gap-2">
                        <Button size="small" text @click.stop="openFileDialog" :disabled="disabled">Заменить</Button>
                        <Button size="small" text severity="danger" @click.stop="clearAll" :disabled="disabled">Очистить</Button>
                    </div>
                </div>
                <div class="relative inline-flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-white">
                    <div class="w-20 h-20 rounded-md overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer"
                         @click.stop="openPreview(filesList[0])">
                        <template v-if="getFileKind(filesList[0]) === 'image'">
                            <img :src="fileDataUrl(filesList[0])" alt="preview" class="object-cover w-full h-full" />
                        </template>
                        <template v-else-if="getFileKind(filesList[0]) === 'pdf'">
                            <span class="text-xs">PDF</span>
                        </template>
                        <template v-else>
                            <span class="text-xs">{{ getIconForFile(filesList[0]) }}</span>
                        </template>
                    </div>
                    <div class="min-w-0">
                        <p class="font-medium truncate max-w-[40vw]" :title="filesList[0].name">{{ filesList[0].name }}</p>
                        <p class="text-xs text-gray-500">{{ formatBytes(filesList[0].size) }} • {{ filesList[0].type || '—' }}</p>
                    </div>
                    <button class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                            @click.stop="removeFile(filesList[0], 0)"
                            :disabled="disabled">×</button>
                </div>
                <div v-if="withComment" class="mt-2">
                    <Textarea v-model="(filesList[0] as FileWithComment).comment" rows="2" auto-resize :disabled="disabled" placeholder="Комментарий" />
                </div>
            </template>

            <!-- Multiple или пусто: показываем заглушку и плитку превью -->
            <template v-else>
                <div class="flex flex-col items-center justify-center cursor-pointer"
                     @click.stop="openFileDialog">
                    <p class="text-gray-700 text-center">{{ placeholder }}</p>
                    <div class="mt-2 text-xs text-gray-500 flex gap-2">
                        <span v-if="accept">Разрешено: {{ accept }}</span>
                        <span v-if="maxSizeMb">Лимит: {{ maxSizeMb }} MB</span>
                        <span v-if="isMultiple && maxFiles">Макс. файлов: {{ maxFiles }}</span>
                    </div>
                    <div class="mt-3">
                        <Button size="small" :disabled="disabled">Выбрать файлы</Button>
                    </div>
                </div>

                <div v-if="filesList.length" class="mt-3 grid grid-cols-6 gap-2" :style="{ gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))' }">
                    <template v-for="(f, idx) in filesList" :key="f.name + '_' + f.size + '_' + idx">
                        <div class="relative group border border-gray-200 rounded-md p-2 bg-white">
                            <div class="w-full aspect-square rounded-md overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center cursor-pointer"
                                 @click.stop="openPreview(f)">
                                <template v-if="getFileKind(f) === 'image'">
                                    <img :src="fileDataUrl(f)" alt="preview" class="object-cover w-full h-full" />
                                </template>
                                <template v-else-if="getFileKind(f) === 'pdf'">
                                    <span class="text-xs">PDF</span>
                                </template>
                                <template v-else>
                                    <span class="text-xs">{{ getIconForFile(f) }}</span>
                                </template>
                            </div>
                            <p class="mt-1 text-xs truncate" :title="f.name">{{ f.name }}</p>
                            <p class="text-[10px] text-gray-500">{{ formatBytes(f.size) }}</p>
                            <button class="hidden group-hover:flex absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white items-center justify-center text-xs"
                                    @click.stop="removeFile(f, idx)"
                                    :disabled="disabled">×</button>
                        </div>
                    </template>
                </div>
            </template>
        </div>

        <!-- Модалка превью изображений и PDF -->
        <Dialog v-model:visible="previewVisible" modal header="Предпросмотр" pt:root:class="!shadow-none !border-0">
            <div v-if="previewFile" class="w-[80vw] h-[80vh]">
                <template v-if="getFileKind(previewFile) === 'image'">
                    <img :src="fileDataUrl(previewFile)" class="w-full h-full object-contain" />
                </template>
                <template v-else-if="getFileKind(previewFile) === 'pdf'">
                    <iframe :src="fileDataUrl(previewFile)" class="w-full h-full" />
                </template>
                <template v-else>
                    <div class="w-full h-full flex items-center justify-center text-sm text-gray-600">Предпросмотр недоступен</div>
                </template>
            </div>
        </Dialog>
    </div>
</template>