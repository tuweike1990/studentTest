<template>
  <Loading v-show="isLoading" />

  <div
    class="w-1/3 mx-auto mt-10 shadow-2xl shadow-gray-300 rounded-box"
    v-show="!isLoading"
  >
    <div class="w-3/4 mx-auto pt-4">
      <select
        class="select select-bordered w-full max-w-xs"
        v-model="currentStudent"
      >
        <option disabled selected>选择学生</option>
        <option v-for="(student, idx) in students" :key="idx" :value="student">
          {{ student.name }}
        </option>
      </select>
      <label class="input input-bordered flex items-center gap-2 my-4">
        <input
          type="text"
          placeholder="数据异常"
          class="input input-bordered w-full max-w-xs"
          :value="currentStudent.student_id"
          disabled
        />
      </label>
      <label class="input input-bordered flex items-center gap-2 my-4">
        <input
          type="text"
          placeholder="数据异常"
          class="input input-bordered w-full max-w-xs"
          :value="`${currentStudent.grade} 年级 | ${currentStudent.class} 班`"
          disabled
        />
      </label>

      <label class="input input-bordered flex items-center gap-2 my-4">
        <input
          type="number"
          placeholder="数据异常"
          class="input input-bordered w-full max-w-xs"
          v-model="score"
          min="0"
          max="100"
        />
      </label>
      <select class="select select-bordered w-full max-w-xs" v-model="subject">
        <option disabled selected>科目</option>
        <option>语文</option>
        <option>数学</option>
        <option>英语</option>
      </select>

      <div class="grid grid-cols-2 my-4 gap-4">
        <select class="select select-bordered w-full" v-model="semesYear">
          <option disabled>年份</option>
          <option v-for="year in yearList" :key="year" :value="year">
            {{ year }}
          </option>
        </select>

        <select class="select select-bordered w-full" v-model="semesterSeason">
          <option disabled selected>学期</option>
          <option>春季</option>
          <option>秋季</option>
        </select>
      </div>
    </div>

    <div class="text-center">
      <button class="btn btn-primary mx-2 my-2" @click="onClick">
        添加分数
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getConfig } from "@/utils/configHelper.js";
import { getStudentList } from "@/services/apiStudent.js";

import Loading from "@/views/Loading.vue";

import { createScore } from "@/services/apiScore.js";
import { useRoute, useRouter } from "vue-router";
import { getUserId } from "@/utils/userHelper.js";

import { useToast } from "vue-toastification";

const router = useRouter();
const name = ref("tuweike");
const isLoading = ref(false);
const currentStudent = ref({
  name: "Tuweike",
  student_id: "20210001",
  grade: "五",
  class: "1",
});

const students = ref([]);

const score = ref(0);
const subject = ref("语文");
const semesterSeason = ref("春季");
const semesYear = ref(new Date().getFullYear());
const yearList = Array.from(
  { length: new Date().getFullYear() - 2000 + 1 },
  (_, i) => 2000 + i,
);
const scoreList = ref([]); // 用于存储即将上传的分数数据列表

const toast = useToast();
async function onClick() {
  const newScoreData = {
    student_id: currentStudent.value.student_id,
    score: score.value,
    subject: subject.value,
    semesterYear: semesYear.value,
    semesterSeason: semesterSeason.value,
  };

  const scores = await createScore(newScoreData);

  toast.clear();
  toast.success("分数上传成功");
  router.push({ name: "score" });
}

onMounted(async () => {
  isLoading.value = true;
  // const token = getConfig("SUPABASE_TOKEN");
  // const userToken = JSON.parse(localStorage.getItem(token));
  // const teacherId = userToken.user.id;
  const teacherId = getUserId();

  students.value = await getStudentList(teacherId);
  currentStudent.value = students.value[0];
  isLoading.value = false;
});
</script>
