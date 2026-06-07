<template>
  <Loading v-show="isLoading" />

  <div
    class="w-1/2 mx-auto mt-10 shadow-2xl shadow-gray-300 rounded-box"
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
          />
        </svg>
        <input type="email" required v-model="currentUserName" disabled />
      </label>

      <select
        class="select select-bordered w-full max-w-xs"
        v-model="currentClass"
        v-if="!isStudent"
      >
        <option disabled selected>请选择班级</option>
        <option v-for="item in classOptions" :key="item">
          {{ item }}
        </option>
      </select>
    </div>

    <div class="text-center my-1.5 mb-1.5">
      <button class="btn btn-primary btn-sm" @click="onClick">更新</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { uploadAvatar } from "@/services/apiStorage.js";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { getTeacherByTeacherId } from "@/services/apiTeacher";
import { updateUser as updateUserInfo } from "@/services/apiAuth";
import { getStudentByStudentId, updateStudent } from "@/services/apiStudent";
import { getConfig } from "@/utils/configHelper.js";
import { getUserId } from "@/utils/userHelper";

import { useToast } from "vue-toastification";

import Loading from "@/views/Loading.vue";

const userStore = useUserStore();
const isLoading = ref(false);
const { updateUser } = userStore;
const { user, isStudent } = storeToRefs(userStore);

const currentAvatarUrl = ref(
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
);

const currentUserName = ref("");
const currentAvatarFile = ref(null);
const currentClass = ref("1班");
const classOptions = ref([]);

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
  if (!currentAvatarFile.value) {
    toast.clear();
    toast.warning("未上传新的头像");
    return;
  }

  toast.info("头像上传中...");
  //build avatar url file name

  const token = getConfig("SUPABASE_TOKEN");
  const userToken = JSON.parse(localStorage.getItem(token));
  const newAvatarName = `/${userToken.user.email}-${Date.now()}.png`;

  const supabaseUrl = getConfig("SUPABASE_URL");
  //upload avatar file
  const data = await uploadAvatar(currentAvatarFile.value, newAvatarName);

  const newAvatarUrl = `${supabaseUrl}/storage/v1/object/public/avatar${newAvatarName}`;
  //update user info with new avatar url

  const updateUserData = await updateUserInfo({
    avatar: newAvatarUrl,
  });
  console.log("头像上传成功", data);
  if (isStudent.value) {
    const userId = getUserId();
    const students = await updateStudent(userId, {
      avatar: newAvatarUrl,
    });
    console.log("学生信息更新成功", students);
  }
  updateUser(updateUserData.user.user_metadata);

  toast.clear();
  toast.success("头像上传成功");
}

onMounted(async () => {
  isLoading.value = true;

  currentAvatarUrl.value = user.value.avatar;

  const userId = getUserId();

  if (!userId) {
    console.warn("未找到用户 ID");
    return;
  }

  const teacher = isStudent.value
    ? await getStudentByStudentId(userId)
    : await getTeacherByTeacherId(userId);

  console.log(isStudent.value ? "当前是学生信息" : "当前是老师信息", teacher);

  if (!teacher) return;

  currentUserName.value = teacher.name;

  // 安全解析 class_in_charge
  if (teacher.class_in_charge) {
    let arr = [];

    try {
      arr = JSON.parse(teacher.class_in_charge);
    } catch {
      // 兜底：单引号 → 双引号
      arr = JSON.parse(teacher.class_in_charge.replace(/'/g, '"'));
    }

    // arr = ["1|2|3|4|5"]
    const classes = arr[0].split("|"); // ["1","2","3","4","5"]

    classOptions.value = classes.map((c) => `${c}班`);
    currentClass.value = classOptions.value[0];
  }

  isLoading.value = false;
});
</script>
