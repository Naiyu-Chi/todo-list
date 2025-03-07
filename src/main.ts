import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhTw from 'element-plus/es/locale/lang/zh-tw'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(ElementPlus, { locale: zhTw });
app.mount('#app')
