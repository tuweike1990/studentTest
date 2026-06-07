import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const user = ref({
    avatar:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  });

  const isStudent = computed(() => (user.value.isStudent ? true : false));

  function updateUser(newUserMetadata = {}) {
    user.value = { ...user.value, ...newUserMetadata };
  }
  return { user, updateUser, isStudent };
});
