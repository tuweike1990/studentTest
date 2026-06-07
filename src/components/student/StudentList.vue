<template>
  <Loading v-show="isLoading" />

  <!--content-->
  <div class="overflow-x-auto" v-show="!isLoading">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <!-- <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th> -->
          <th>姓名</th>
          <th>年级</th>
          <th>班级</th>
          <!-- <th>班主任</th> -->
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <template v-if="filteredStudentList.length">
          <StudentItemList
            :studentList="filteredStudentList"
            @refresh="refreshStudentList"
          />
        </template>

        <tr v-else>
          <td colspan="5" class="text-center text-gray-400 py-6">
            未查询到符合条件的学生
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="my-4"
      v-if="!isSearching && filteredStudentList.length && pageCount > 1"
    >
      <Pagination :currentPage="currentPage" :pageCount />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";

import { getConfig } from "@/utils/configHelper.js";
import { getUserId } from "@/utils/userHelper.js";
import { useRoute, useRouter } from "vue-router";

import Loading from "@/views/Loading.vue";
import StudentItemList from "./StudentItemList.vue";

import Pagination from "@/views/Pagination.vue";
import {
  getStudentList,
  countStudentList,
  getStudentListWidthLimit,
} from "@/services/apiStudent.js";

import { useSearchStore } from "@/stores/searchStore.js";

const studentList = ref([]);

const isLoading = ref(false);

const router = useRouter();
const route = useRoute();
const currentPage = ref(route.query.page || 1);
const pageSize = getConfig("PAGE_SIZE");

const countStudent = ref(0);
const pageCount = computed(() => {
  return Math.ceil(countStudent.value / pageSize);
});

const searchStore = useSearchStore();

async function fetchStudentList() {
  isLoading.value = true;

  router.push({ query: { page: currentPage.value } });

  // const token = getConfig("SUPABASE_TOKEN");
  // const userToken = JSON.parse(localStorage.getItem(token));

  const teacherId = getUserId();
  if (!isSearching.value) {
    studentList.value = await getStudentListWidthLimit(
      teacherId,
      currentPage.value,
      pageSize,
    );
  } else {
    studentList.value = await getStudentList(teacherId);
  }

  isLoading.value = false;
}

//定义是否查询。拿全部数据
const isSearching = computed(() => {
  return !!searchStore.searchKeyword?.trim();
});

watch(
  () => currentPage.value,
  () => {
    fetchStudentList();
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

const filteredStudentList = computed(() => {
  const keyword = searchStore.searchKeyword?.trim().toLowerCase();
  if (!keyword) return studentList.value;

  return studentList.value.filter((student) => {
    return (
      student.name?.toLowerCase().includes(keyword) ||
      student.grade?.toLowerCase().includes(keyword) ||
      student.class?.toLowerCase().includes(keyword)
    );
  });
});

onMounted(async () => {
  const userId = getUserId();
  router.push({ query: { page: currentPage.value } });
  fetchStudentList();
  const studentData = await countStudentList(userId);
  countStudent.value = studentData;
});

async function refreshStudentList() {
  // const token = getConfig("SUPABASE_TOKEN");
  // const userToken = JSON.parse(localStorage.getItem(token));

  // const teacherId = userToken?.user?.id;
  // const teacherId = getUserId();
  // studentList.value = await getStudentList(teacherId);

  await fetchStudentList();
}
</script>

<style scoped></style>
