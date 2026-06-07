import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "@/utils/supabase";
import { isAuthemsicated } from "@/utils/authHelper.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home/score",
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      redirect: "/home/score",
      children: [
        {
          path: "score",
          children: [
            {
              path: "",
              name: "score",
              component: () => import("@/components/score/ScoreList.vue"),
            },
            {
              path: ":id",
              name: "scoreEdit",
              component: () => import("@/components/score/ScoreEdit.vue"),
            },
            {
              path: "upload",
              name: "scoreUpload",
              component: () => import("@/components/score/ScoreUpload.vue"),
            },
          ],
        },
        {
          path: "student",
          children: [
            {
              path: "",
              name: "student",
              component: () => import("@/components/student/StudentList.vue"),
            },
            {
              path: ":id",
              name: "studentEdit",
              component: () => import("@/components/student/StudentEdit.vue"),
            },
            {
              path: "addStudent",
              name: "addStudent",
              component: () => import("@/components/student/AddStudent.vue"),
            },
          ],
        },
        {
          path: "info",
          name: "info",
          component: () => import("@/components/user/Info.vue"),
        },
      ],
    },

    {
      path: "/login",
      name: "login",
      component: () => import("@/components/auth/Login.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/components/auth/Signup.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: () => import("@/views/Page404.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const routeName = to.name; // 获取路由名称
  console.log("路由守卫", routeName);
  if (routeName !== "login" && routeName !== "signup") {
    console.log("检查登录状态");
    const isLogin = await isAuthemsicated();
    if (!isLogin) {
      console.log("未登录，重定向到登录页");
      router.push({ name: "login" });
      return; // 阻止导航
    }
  }
});

export default router;
