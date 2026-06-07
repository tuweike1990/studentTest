import { supabase } from "@/utils/supabase.js";
import avatar from "daisyui/components/avatar";
import { ref } from "vue";

export async function signUp(email, password, metadata = {}) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: `User-${Date.now()}`,
        avatar:
          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
        ...metadata,
      },
    },
  });

  if (error) {
    //console.log(error.message);
    console.error("signUp error:", error); // 👈 重点
    return;
  }
  return data;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

export async function logout() {
  let { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error.message);
    return;
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.log(error.message);
    return;
  }
  return user;
}

//更新用户
export async function updateUser(newUserData = {}) {
  const { data, error } = await supabase.auth.updateUser({
    data: newUserData,
  });
  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

//登录时点击选中记住我保存账号与密码，点击退出登录时清除
// apiAuth.js
export function remeberMe() {
  function saveSession(isCheck, email, password) {
    if (isCheck) {
      localStorage.setItem(
        "logingSession",
        JSON.stringify({ email, password }),
      );
    } else {
      localStorage.removeItem("logingSession");
    }
    console.log("saveSession:", { email, password });
  }

  return {
    saveSession,
  };
}
