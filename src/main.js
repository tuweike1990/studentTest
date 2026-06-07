import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";

import "./assets/main.css";
import Toast, { POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
const app = createApp(App);
app.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 1000, // 显示 2 秒后自动关闭（毫秒）
  closeOnClick: true, // 点击关闭
  pauseOnHover: false, // 鼠标悬停时不关闭
  hideProgressBar: false,
});
app.use(createPinia());
app.use(router);
app.mount("#app");
