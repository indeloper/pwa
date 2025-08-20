import 'reflect-metadata';
// import './decorators/test-decorators'; // Тест декораторов
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import {ru} from 'primelocale/js/ru.js';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: 'dark-theme'
        }
    },
    locale: ru,
});
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.use(pinia).use(router).mount('#app')
