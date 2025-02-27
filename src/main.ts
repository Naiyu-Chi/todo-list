import 'element-plus/dist/index.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(ElementPlus)
app.mount('#app')
