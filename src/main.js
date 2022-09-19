import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/router'
import { createPinia } from 'pinia'
//引入公共样式
import '@/style/index.less'
//引入css图标
import '@/icon/iconfont.css'
//路由守卫
import '@/router/permission'

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount('#app');
