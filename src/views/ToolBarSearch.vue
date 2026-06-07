<template>
  <div
    class="my-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 w-1/2 mx-auto"
  >
    <div class="col-span-2">
      <!-- <div class="badge badge-info gap-2 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-4 w-4 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
        info
      </div> -->
    </div>
    <div class="col-span-1">
      <label class="input input-bordered flex items-center">
        <input
          type="text"
          class="grow"
          :placeholder="placeholderText"
          v-model="searchStore.searchKeyword"
          @input="onSearch"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
    </div>

    <button
      class="btn btn-primary col-span-1"
      @click="onClick"
      v-if="!isStudent"
    >
      {{ route.name === "score" ? "添加分数" : "添加学生" }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

import { useSearchStore } from "@/stores/searchStore";
const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const searchStore = useSearchStore();

const { isStudent } = storeToRefs(userStore);

//绑定搜索框
// const searchKeyword = ref(searchStore.searchKeyword);

// 动态 placeholder
const placeholderText = computed(() =>
  route.name === "score" ? "搜索科目 / 学期 / 成绩" : "搜索学生姓名 / 班级",
);

// 输入时同步到 Pini
function onSearch() {
  searchStore.setSearchKeyword(searchStore.searchKeyword);
}

function onClick() {
  if (route.name === "score") {
    router.push({ name: "scoreUpload" });
    return;
  } else {
    router.push({ name: "addStudent" });
  }
}
</script>

<style scoped></style>
