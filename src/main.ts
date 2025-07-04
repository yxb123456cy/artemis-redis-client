import {createApp} from 'vue'
import ArcoVue from '@arco-design/web-vue';
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import router from './router';
import pinia from "./store";

const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(pinia);
app.use(router);
app.mount('#app');