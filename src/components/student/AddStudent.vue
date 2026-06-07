<template>
  <Loading v-show="isLoading" />

  <div
    class="w-1/3 mx-auto mt-10 shadow-2xl shadow-gray-300 rounded-box"
    v-show="!isLoading"
  >
    <div class="w-3/4 mx-auto pt-4">
      <label class="input input-bordered flex items-center gap-2 my-4">
        <input
          type="text"
          placeholder="请输入邮箱"
          class="input input-bordered w-full max-w-xs"
          v-model="email"
        />
      </label>
      <label class="input input-bordered flex items-center gap-2 my-4">
        <input
          type="text"
          placeholder="请输入姓名"
          class="input input-bordered w-full max-w-xs"
          v-model="name"
        />
      </label>
      <select
        class="select select-bordered w-full max-w-xs mb-4"
        v-model="currentGrade"
      >
        <option disabled selected>请选择年级</option>
        <option v-for="item in gradeOptions" :key="item">
          {{ item }}
        </option>
      </select>
      <select
        class="select select-bordered w-full max-w-xs mb-4"
        v-model="currentClass"
      >
        <option disabled selected>请选择班级</option>
        <option v-for="item in classOptions" :key="item">
          {{ item }}
        </option>
      </select>
      <select class="select select-bordered w-full max-w-xs" v-model="gender">
        <option disabled selected>请选择性别</option>
        <option value="male">男</option>
        <option value="female">女</option>
      </select>
    </div>

    <div class="text-center">
      <button class="btn btn-primary mx-2 my-2" @click="onClick">
        添加学生
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getConfig } from "@/utils/configHelper.js";
import { getTeacherByTeacherId } from "@/services/apiTeacher";
import avatar from "daisyui/components/avatar";
import { createStudent } from "@/services/apiStudent.js";
import { signUp } from "@/services/apiAuth";
import Loading from "@/views/Loading.vue";
import { getUserId } from "@/utils/userHelper";

import { useToast } from "vue-toastification";

const router = useRouter();
const isLoading = ref(false);
const email = ref("");
const name = ref("");
const gender = ref("male");
const gradeOptions = ref([
  "一年级",
  "二年级",
  "三年级",
  "四年级",
  "五年级",
  "六年级",
]);
const currentGrade = ref("一年级");
const currentClass = ref("1班");

const classOptions = ref(["1班", "2班", "3班", "4班", "5班", "6班"]);

const teacherId = ref("");

onMounted(async () => {
  isLoading.value = true;

  // 可以在这里获取班级列表并赋值给 classOptions
  // const token = getConfig("SUPABASE_TOKEN");
  // const userToken = JSON.parse(localStorage.getItem(token));
  // teacherId.value = userToken?.user?.id;

  teacherId.value = getUserId();
  if (!teacherId.value) {
    console.warn("未找到用户 ID");
    return;
  }

  const teacher = await getTeacherByTeacherId(teacherId.value);
  if (!teacher) return;
  //console.log(teacher);

  // 安全解析 class_in_charge
  if (teacher.class_in_charge) {
    let arr = [];

    try {
      arr = JSON.parse(teacher.class_in_charge);
    } catch {
      arr = JSON.parse(teacher.class_in_charge.replace(/'/g, '"'));
    }

    // arr = ["1|2|3|4|5"]
    const classes = arr[0].split("|"); // ["1","2","3","4","5"]

    //classOptions.value = classes.map((c) => `${c}班`);
    currentClass.value = classOptions.value[0];

    currentGrade.value = gradeOptions.value[0];
  }

  isLoading.value = false;
});

const toast = useToast();

async function onClick() {
  if (!email.value || !name.value) {
    alert("请填写完整信息");
    return;
  }

  toast.info("正在添加学生，请稍候...");
  const userData = await signUp(email.value, "123456", {
    isStudent: true,
  });

  const studentId = userData.user.id;

  const student = await createStudent({
    name: name.value,
    class: currentClass.value.slice(0, -1),
    grade: currentGrade.value.slice(0, -1), // 从 "1班" 中提取 "1"
    gender: gender.value,
    teacher_id: teacherId.value,
    student_id: studentId,
    avatar:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  });

  email.value = "";
  name.value = "";
  toast.clear();
  toast.success("添加成功");
  router.push({ name: "student" });
}
</script>
