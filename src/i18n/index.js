import { ref, inject } from 'vue';

// 定义注入的key（避免命名冲突）
const I18N_KEY = Symbol('i18n');

/**
 * 创建i18n实例
 * @param {Object} options - 配置项
 * @param {string} options.locale - 默认语言
 * @param {Object} options.messages - 多语言配置 { 'zh-CN': { ... }, 'en-US': { ... } }
 */
export function createI18n(options) {
  // 1. 响应式存储当前语言（核心：切换时触发视图更新）
  const locale = ref(options.locale || 'zh-CN');
  
  // 2. 核心翻译函数：实现key解析、参数插值、回退逻辑
  const t = (key, params = {}) => {
    // 步骤1：拆分分层key（如 'login.title' → ['login', 'title']）
    const keyPath = key.split('.');
    
    // 步骤2：从当前语言的messages中查找文本
    let text = keyPath.reduce((current, k) => {
      return current && current[k] ? current[k] : null;
    }, options.messages[locale.value]);

    // 步骤3：找不到则返回key本身（兜底）
    if (!text) return key;

    // 步骤4：参数插值（替换 {{变量名}}）
    return text.replace(/{{(\w+)}}/g, (_, paramKey) => params[paramKey] || '');
  };

  // 3. 切换语言的方法
  const switchLocale = (lang) => {
    // 校验语言是否存在，不存在则用默认值
    if (options.messages[lang]) {
      locale.value = lang;
    } else {
      console.warn(`语言 ${lang} 未配置，使用默认语言 ${locale.value}`);
    }
  };

  // 4. Vue插件：全局注册+依赖注入
  const install = (app) => {
    // 全局挂载 $t 方法（模板中可直接用）
    app.config.globalProperties.$t = t;
    
    // 提供给组合式API useI18n 使用
    const i18nContext = { locale, t, switchLocale, setLocaleMessage };
    app.provide(I18N_KEY, i18nContext);
  };

  // 5. 新增动态注入messages的方法
  const setLocaleMessage = (lang, messages) => {
    options.messages = messages
    options.messages[lang] = { ...options.messages[lang], ...messages };
  };

  return { 
    install, 
    locale, 
    t, 
    switchLocale, 
    setLocaleMessage,
  };
}

/**
 * 组合式API：在setup中使用
 */
export function useI18n() {
  const i18nContext = inject(I18N_KEY);
  if (!i18nContext) {
    throw new Error('请先调用 app.use(i18n) 注册插件');
  }
  return i18nContext;
}