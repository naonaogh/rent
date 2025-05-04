import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';

const app = createApp(App);

// Устанавливаем базовый URL для axios
axios.defaults.baseURL = 'http://localhost:8000';

// Делаем axios доступным через this.$axios
app.config.globalProperties.$axios = axios;

// Инициализация авторизации
store.dispatch('auth/initAuth').then(() => {
  app.use(store);
  app.use(router);
  app.mount('#app');
});