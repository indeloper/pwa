import BaseApi from "./BaseApi";
import { ref } from 'vue';

export default class MaterialOperationApi extends BaseApi<any> {
    // Статические реактивные переменные для данных
    static items = ref<any[]>([]);
    static loading = ref(false);
    static progress = ref<{ percentage: number; current: number; total: number; chunk_size?: number } | null>(null);
    static completed = ref(false);
    static error = ref<string | null>(null);

    private static streamHandle: { close: () => void } | null = null;

    static fetchAllStream() {
        // Если поток уже запущен, не запускаем повторно
        if (this.streamHandle) {
            console.log('⚠️ Поток уже запущен, возвращаем существующий');
            return {
                items: this.items,
                loading: this.loading,
                progress: this.progress,
                completed: this.completed,
                error: this.error,
                stop: () => this.stopStream()
            };
        }

        // Сброс состояния
        this.items.value = [];
        this.loading.value = true;
        this.progress.value = null;
        this.completed.value = false;
        this.error.value = null;

        console.log('🚀 Запускаем поток к:', '/heavy-data-test');
        
        const api = new MaterialOperationApi();
        this.streamHandle = api.openEventStream('/heavy-data-test', {
            withCredentials: true,
            onOpen: (ev) => {
                console.log('✅ Соединение установлено:', ev);
            },
            onMessage: (data) => {
                console.log('📨 Получено обычное сообщение:', data);
                // Временно: обрабатываем как данные
                this.items.value.push(data);
            },
            events: {
                start: (info) => {
                    console.log('🏁 Начинаем загрузку:', info);
                    this.loading.value = true;
                    // Инициализируем прогресс с данными из start события
                    this.progress.value = {
                        percentage: 0,
                        current: 0,
                        total: info.total || 0,
                        chunk_size: info.chunk_size
                    };
                },
                data: (chunk) => {
                    console.log(`📦 Получено ${chunk.items?.length || 0} записей. Прогресс: ${chunk.progress?.percentage || 0}%`);
                    // Используем lodash для быстрого обновления
                    if (chunk.items) {
                        this.items.value.push(...chunk.items);
                    }
                    if (chunk.progress) {
                        this.progress.value = chunk.progress;
                    }
                },
                complete: (result) => {
                    console.log('🎉 Загрузка завершена:', result);
                    this.loading.value = false;
                    this.completed.value = true;
                    // API сам закрывает поток
                    this.streamHandle?.close();
                    this.streamHandle = null;
                }
            },
            onError: (ev) => {
                console.error('❌ Ошибка потока:', ev);
                this.error.value = 'Ошибка загрузки данных';
                this.loading.value = false;
                // API сам закрывает поток при ошибке
                this.streamHandle?.close();
                this.streamHandle = null;
            }
        });
        
        console.log('🔗 StreamHandle создан:', this.streamHandle);

        return {
            items: this.items,
            loading: this.loading,
            progress: this.progress,
            completed: this.completed,
            error: this.error,
            stop: () => this.stopStream()
        };
    }

    private static stopStream() {
        if (this.streamHandle) {
            this.streamHandle.close();
            this.streamHandle = null;
            this.loading.value = false;
        }
    }

    static async fetchData() {
        const api = new MaterialOperationApi();
        return await api.getJson<any>('/material-operations-data');
    }
}