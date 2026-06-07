<template>
  <Loading v-show="isLoading" />

  <div
    class="w-1/3 mx-auto mt-10 shadow-2xl shadow-gray-300 rounded-box"
    v-show="!isLoading"
  >
    <h1 class="text-2xl font-bold text-center pt-4">
      {{ currentStudent.name }}
    </h1>
    <div class="w-3/4 mx-auto">
      <label class="input input-bordered flex items-center gap-2 my-4">
        <input
          type="text"
          placeholder="班级"
          class="input input-bordered w-full max-w-xs"
          :value="`${currentStudent.grade}级${currentStudent.class}班`"
          disabled
        />
      </label>

      <label class="input input-bordered flex items-center gap-2 my-4">
        <input
          type="number"
          placeholder="Type here"
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

      <div class="grid grid-cols-2 my-4 gap-2">
        <select
          class="select select-bordered w-full max-w-xs"
          v-model="semesYear"
        >
          <option disabled>年份</option>
          <option v-for="year in yearList" :key="year" :value="year">
            {{ year }}
          </option>
        </select>

        <select
          class="select select-bordered w-full max-w-xs"
          v-model="semesItem"
        >
          <option disabled selected>学期</option>
          <option>春季</option>
          <option>秋季</option>
        </select>
      </div>
    </div>

    <div class="text-center">
      <button class="btn btn-primary mx-2 my-2" @click="onClick">
        更新分数
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import Loading from "@/views/Loading.vue";
import { PatchFlagNames } from "@vue/shared";

import { getScoreByScoreId, updateScore } from "@/services/apiScore";
import { getStudentByStudentId } from "@/services/apiStudent";

import { useToast } from "vue-toastification";

const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const scoreId = route.params.id;

const name = ref("");
const currentStudent = ref({});
const score = ref("");
const subject = ref("");
const semesItem = ref("");
const semesYear = ref(new Date().getFullYear());
const yearList = Array.from(
  { length: new Date().getFullYear() - 2000 + 1 },
  (_, i) => 2000 + i,
);

const toast = useToast();

async function onClick() {
  toast.info("正在更新分数，请稍后...");

  const newScore = {
    score: score.value,
    subject: subject.value,
    semesterSeason: semesItem.value,
    semesterYear: semesYear.value,
  };

  const res = await updateScore(scoreId, newScore);
  console.log(res);

  if (res) {
    toast.clear();
    toast.success("分数更新成功");
    router.push({ name: "score" });
  }
}

onMounted(async () => {
  isLoading.value = true;
  const scoreData = await getScoreByScoreId(scoreId);
  score.value = scoreData.score;
  subject.value = scoreData.subject;
  semesItem.value = scoreData.semesterSeason;
  semesYear.value = scoreData.semesterYear;

  const student = await getStudentByStudentId(scoreData.student_id);
  currentStudent.value = student;
  //console.log("输出数据", currentStudent.value);
  isLoading.value = false;
});
</script>
