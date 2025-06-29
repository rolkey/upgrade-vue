import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_BASE_PATH } = env;
  const vitePlugins = [
    vue(),
    Unocss(),
    AutoImport({
      imports: ["vue", "vue-router"],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ];
  return {
    base: VITE_BASE_PATH || "/",
    plugins: vitePlugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "~": path.resolve(__dirname, "./src/components"),
        // "#": path.resolve(__dirname, "./../his-vue-share/src"),
        // "@main": path.resolve(__dirname, "./../web"),
      },
    },
    server: {
      port: 9902,
      host: true,
      open: false,
      cors: {
        origin: "*", // 允许所有域名跨域访问
      },
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: { api: "modern-compiler" },
    //   },
    // },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    build: {
      rollupOptions: {
        external: ["virtual:uno.css"],
      },
    },
  };
});
