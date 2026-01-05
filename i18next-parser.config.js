module.exports = {
  // 目标语言（按需添加，如ja-JP、ko-KR）
  locales: ["zh-CN", "en-US"],
  // 输出路径：Vite项目推荐src/locales，按语言+命名空间拆分
  output: "src/locales/$LOCALE/$NAMESPACE.json",
  // 扫描范围：覆盖Vue/JS/TS文件，排除node_modules和locales目录
  input: [
    "src/**/*.{vue,js,ts}",
    "!src/**/node_modules/**",
    "!src/locales/**",
    "!dist/**"
  ],
  // 键分隔符：保持和vue-i18n一致的.分层
  keySeparator: ".",
  nsSeparator: ":", // 命名空间分隔符（如common:submit）
  // 解析规则：适配Vue3模板和脚本中的翻译函数
  parsers: [
    {
      // 解析Vue模板中的$t('key')、t('key')
      parser: "i18next-parser-vue",
      extensions: [".vue"],
      // 匹配Vue模板中的翻译函数
      functions: ["$t", "t"]
    },
    {
      // 解析JS/TS中的t('key')、useI18n的t函数
      parser: "javascript",
      extensions: [".js", ".ts"],
      functions: ["t", "i18n.t", "useI18n().t"]
    }
  ],
  // 不创建旧配置文件，避免冗余
  createOldCatalogs: false,
  // 按字母排序key，方便维护
  sort: true,
  // 未翻译key的默认值：中文填充key，英文留空待翻译
  defaultValue: (locale) => (locale === "zh-CN" ? "" : ""),
  // 忽略注释中的文本（避免误扫描）
  ignoreComments: true
};