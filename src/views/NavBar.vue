<template>
  <div class="navbar bg-base-300 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li class="active">
            <a
              :class="route.path.startsWith('/home/score') ? 'active' : ''"
              @click="router.push({ name: 'score' })"
              >Score</a
            >
          </li>
          <li>
            <a
              :class="route.path.startsWith('/home/student') ? 'active' : ''"
              @click="router.push({ name: 'student' })"
              >Student</a
            >
          </li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl">{{
        !isStudent ? "老师端" : "学生端"
      }}</a>
    </div>

    <!-- pc导航栏中心 -->
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1" v-if="!isStudent">
        <li>
          <a
            :class="route.path.startsWith('/home/score') ? 'active' : ''"
            @click="goTo('score')"
            >分数</a
          >
        </li>
        <li>
          <a
            :class="route.path.startsWith('/home/student') ? 'active' : ''"
            @click="goTo('student')"
            >学生</a
          >
        </li>
      </ul>
    </div>

    <!-- 用户信息 -->
    <div class="navbar-end">
      <ToggleTheme />&nbsp;&nbsp;

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img alt="Tailwind CSS Navbar component" :src="user.avatar" />
          </div>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a class="justify-between" @click="router.push({ name: 'info' })">
              个人信息
            </a>
          </li>
          <li><a @click="handleLogout">退出</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { logout } from "@/services/apiAuth.js";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { getConfig } from "@/utils/configHelper.js";
import ToggleTheme from "./ToggleTheme.vue";

import { useSearchStore } from "@/stores/searchStore.js";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { updateUser } = userStore;
const { user, isStudent } = storeToRefs(userStore);
const currentPageAuto = ref(1);

const searchStore = useSearchStore();
async function handleLogout() {
  await logout();
  router.push({ name: "login" });
}
function goTo(count) {
  router.push({ name: count, query: { page: currentPageAuto.value } });
  searchStore.clear();
}

onMounted(() => {
  //router.push({ query: { page: currentPage.value } });
  const token = getConfig("SUPABASE_TOKEN");
  const userToken = JSON.parse(localStorage.getItem(token));
  const userMetadata = userToken?.user?.user_metadata;

  updateUser(userMetadata);
});
</script>

<style scoped>
ul.menu li a.active {
  background-color: #000;
  color: white;
}
</style>
