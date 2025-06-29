import { defineConfig, presetWind3, presetAttributify } from "unocss";

export default defineConfig({
  // 配置选项
  presets: [presetWind3(), presetAttributify()],
  content: {
    filesystem: [
      // 静态扫描的默认路径
      "**/*.{html,js,ts,vue}",
      // 显式添加动态加载的 Vue 文件路径（需匹配实际路径）
      "src/views/**/*.vue", // 例如路由懒加载的组件目录
    ],
  },
  mode: "vue-scoped",
});
