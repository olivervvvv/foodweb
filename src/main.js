import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios';

import App from './App.vue'
import router from './router'



const app = createApp(App)
app.config.globalProperties.$axios = axios; // 使用 config.globalProperties 設置全局屬性

app.use(createPinia())
app.use(router)

app.mount('#app')

