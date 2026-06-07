<template>
  <Loading v-show="isLoading" />
  <div class="overflow-x-auto" v-show="!isLoading">
    <table class="table">
      <thead>
        <tr>
          <th>姓名</th>
          <th>班级</th>
          <th>学科</th>
          <th>学期</th>
          <th>分数</th>
          <th v-if="!isStudent">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="searchedScoreList.length">
          <ScoreListItem
            v-for="scoreItem in filteredScoreListByPage"
            :key="scoreItem.id"
            :scoreItem="scoreItem"
            :currentStudent="
              isStudent
                ? students[0]
                : students.find(
                    (student) => student.student_id === scoreItem.student_id,
                  )
            "
            @refresh="refreshScoreList"
            v-if="students.length > 0"
          />
        </template>
        <tr v-else>
          <td colspan="6" class="text-center text-gray-400 py-6">
            未查询到符合条件的分数记录
          </td>
        </tr>
      </tbody>
    </table>
    <div class="my-4" v-if="searchedScoreList.length">
      <Pagination :currentPage="currentPage" :pageCount="pageCount" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { storeToRefs } from "pinia";

import ScoreListItem from "./ScoreListItem.vue";
import Pagination from "@/views/Pagination.vue";
import Loading from "@/views/Loading.vue";

import { getConfig } from "@/utils/configHelper.js";
import { getScoreList } from "@/services/apiScore.js";
import { getUserId } from "@/utils/userHelper.js";

import { useUserStore } from "@/stores/user.js";

import {
  getStudentList,
  getStudentByStudentId,
} from "@/services/apiStudent.js";

import { useSearchStore } from "@/stores/searchStore.js";

const scoreList = ref([]);
const students = ref([]);

const isLoading = ref(false);
const userStore = useUserStore();
const { isStudent } = storeToRefs(userStore);
const searchStore = useSearchStore();
const filteredScoreList = computed(() => {
  const userId = getUserId();
  if (isStudent.value) {
    return scoreList.value.filter(
      (scoreItem) => scoreItem.student_id === userId,
    );
  } else {
    return scoreList.value.filter((scoreItem) =>
      students.value
        .map((student) => student.student_id)
        .includes(scoreItem.student_id),
    );
  }
});

const router = useRouter();
const route = useRoute();
const currentPage = ref(route.query.page || 1);
const pageSize = getConfig("PAGE_SIZE");
const pageCount = computed(() =>
  //Math.ceil(filteredScoreList.value.length / pageSize),
  Math.ceil(searchedScoreList.value.length / pageSize),
);
const filteredScoreListByPage = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  // return filteredScoreList.value.slice(start, end);

  return searchedScoreList.value.slice(start, end);
});
watch(
  () => currentPage.value,
  () => {
    router.push({ query: { page: currentPage.value } });
  },
);

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = newPage;
  },
);

watch(
  () => searchStore.searchKeyword,
  () => {
    currentPage.value = 1;
  },
);

const searchedScoreList = computed(() => {
  const keyword = searchStore.searchKeyword?.trim().toLowerCase();
  if (!keyword) return filteredScoreList.value;

  return filteredScoreList.value.filter((item) => {
    return (
      item.subject?.toLowerCase().includes(keyword) ||
      item.semester_year?.toLowerCase().includes(keyword) ||
      String(item.score).includes(keyword)
    );
  });
});

onMounted(async () => {
  isLoading.value = true;

  router.push({ query: { page: currentPage.value } });

  //console.log(scoreList.value);
  scoreList.value = await getScoreList();

  // const token = getConfig("SUPABASE_TOKEN");
  // const userToken = JSON.parse(localStorage.getItem(token));
  //通过封装token获取用户id  getUserId()
  const userId = getUserId();
  if (!isStudent.value) {
    students.value = await getStudentList(userId);
  } else {
    const student = await getStudentByStudentId(userId);
    students.value = [student];
  }

  isLoading.value = false;
});

async function refreshScoreList() {
  isLoading.value = true;
  scoreList.value = await getScoreList();
  isLoading.value = false;
}
</script>
