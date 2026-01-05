import { createApp } from 'vue'
import App from './App.vue'

import { createI18n } from './i18n/index.js';
import messages from './i18n/locales.js';


// 创建i18n实例
const i18n = createI18n({
  locale: 'zh-CN', // 默认中文
  messages // 多语言配置
});

// 注册插件
const app = createApp(App);
app.use(i18n);
app.mount('#app');