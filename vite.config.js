import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";
// import { resolve } from "path";
// import vueDevTools from "vite-plugin-vue-devtools";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [vue(), vueDevTools(), tailwindcss()],

//   base: "./", // Electron 必须使用相对路径

//   resolve: {
//     alias: {
//       "@": resolve(__dirname, "src"),
//     },
//   },

//   server: {
//     host: "localhost",
//     port: 5173,
//     hmr: true,
//   },

//   build: {
//     outDir: "dist",
//     emptyOutDir: true,
//     rollupOptions: {
//       input: {
//         main: "index.html",
//       },
//     },
//   },
// });
