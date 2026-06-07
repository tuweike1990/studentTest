import { supabase } from "@/utils/supabase";
import { getConfig } from "@/utils/configHelper";
import { updateUser } from "@/services/apiAuth";
import { ref } from "vue";

export async function uploadAvatar(file, newAvatarFileName) {
  //const newAvatarName = `/${userToken.user.email}-${Date.now()}.png`;
  const { error } = await supabase.storage
    .from("avatar")
    .upload(`${newAvatarFileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.log(error);
    return;
  }

  //return updateUserData;
}

//黑夜模式
export function useTheme() {
  const currentTheme = ref("light");

  function toggleTheme() {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
    //需要把当前主题保存到缓存里
    localStorage.setItem("data-theme", currentTheme.value);
    document.documentElement.setAttribute(
      "data-theme",
      localStorage.getItem("data-theme"),
    );
  }

  return {
    currentTheme,
    toggleTheme,
  };
}
