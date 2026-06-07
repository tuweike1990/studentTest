<template>
  <Loading v-show="isLoading" />
  <div
    class="w-1/3 mx-auto mt-10 shadow-2xl shadow-gray-300 rounded-box"
    v-show="!isLoading"
  >
    <div class="avatar flex justify-center mt-5">
      <div class="w-24 rounded-full cursor-pointer my-5">
        <label for="avatar-input" class="cursor-pointer">
          <img :src="currentAvatarUrl"
        /></label>
      </div>
    </div>
    <input
      id="avatar-input"
      type="file"
      class="file-input hidden"
      accept="image/*"
      @change="handleAvatar"
    />
    <div class="w-3/4 mx-auto">
      <label class="input input-bordered flex items-center gap-2 my-4">
        <input
          type="text"
          placeholder="请输入姓名"
          class="input input-bordered w-full max-w-xs"
          v-model="name"
        />
      </label>

      <select class="select select-bordered w-full max-w-xs" v-model="gender">
        <option disabled selected>请选择性别</option>
        <option>男</option>
        <option>女</option>
      </select>
    </div>

    <div class="text-center">
      <button class="btn btn-primary mx-2 my-2" @click="onClick">
        更新信息
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getStudentByStudentId } from "@/services/apiStudent.js";
import { getConfig } from "@/utils/configHelper";
import Loading from "@/views/Loading.vue";
import { uploadAvatar } from "@/services/apiStorage.js";
import { updateStudent } from "@/services/apiStudent";

import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const name = ref("");
const gender = ref("");
const currentAvatarFile = ref(null);
const currentAvatarUrl = ref(
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
);
function handleAvatar(event) {
  const file = event.target.files[0];

  currentAvatarFile.value = file;
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentAvatarUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
const toast = useToast();

async function onClick() {
  toast.info("正在更新信息，请稍后...");
  const newStudentData = {
    name: name.value,
    gender: gender.value === "男" ? "male" : "female",
  };
  if (currentAvatarFile.value) {
    //build avatar url file name

    const token = getConfig("SUPABASE_TOKEN");
    const supabaseUrl = getConfig("SUPABASE_URL");
    const userToken = JSON.parse(localStorage.getItem(token));

    const newAvatarName = `/${userToken.user.email}-${Date.now()}.png`;
    //upload avatar file
    await uploadAvatar(currentAvatarFile.value, newAvatarName);

    const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatar${newAvatarName}`;

    newStudentData.avatar = avatarUrl;
  }
  const student = await updateStudent(route.params.id, newStudentData);

  //console.log("学生信息更新");
  toast.clear();
  toast.success("学生信息更新成功");
  router.push({ name: "student" });
}

onMounted(async () => {
  isLoading.value = true;
  const studentId = route.params.id;
  const student = await getStudentByStudentId(studentId);
  //console.log(student);
  name.value = student.name;
  gender.value = student.gender === "female" ? "女" : "男";
  currentAvatarUrl.value = student.avatar;
  isLoading.value = false;
});
</script>
