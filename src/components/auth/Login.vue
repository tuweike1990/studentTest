<template>
  <Form
    class="w-1/2 mx-auto mt-10 shadow-2xl shadow-gray-300 rounded-box"
    @submit="onClick"
    :validation-schema="schema"
  >
    <h1 class="text-2xl font-bold text-center">登录</h1>
    <div class="w-3/4 mx-auto">
      <label class="input input-bordered flex items-center gap-2 my-4">
        <svg
          class="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <Field
          name="email"
          type="email"
          placeholder="输入邮箱"
          required
          v-model="email"
        />
        <ErrorMessage name="email" class="text-red-400" />
      </label>
      <label class="input input-bordered flex items-center gap-2 my-4">
        <svg
          class="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
            ></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <Field
          name="password"
          type="password"
          required
          placeholder="输入密码"
          minlength="8"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
          v-model="password"
        />
        <ErrorMessage name="password" class="text-red-400" />
      </label>

      <div class="grid grid-cols-1 gap-1">
        <div @click="toggleRemeberMe">
          <input
            type="checkbox"
            :checked="isChecked"
            class="checkbox checkbox-primary"
          />
          <span class="mx-2">记住我</span>
        </div>
      </div>
    </div>

    <div class="text-center">
      <button class="btn btn-primary mx-2 my-2">登录</button>
      <button
        class="btn btn-secondary mx-2 my-2"
        @click="$router.push({ name: 'signup' })"
      >
        注册
      </button>
    </div>
  </Form>
</template>

<script setup>
import { ref } from "vue";
import { login } from "@/services/apiAuth.js";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import toggle from "daisyui/components/toggle";

import { remeberMe } from "@/services/apiAuth";

const router = useRouter();

const email = ref("");
const password = ref("");
const isChecked = ref(false);

const { saveSession } = remeberMe();

const schema = yup.object({
  email: yup.string().required("请输入邮箱").email(),
  password: yup.string().required("请输入密码").min(6),
});

function toggleRemeberMe() {
  isChecked.value = !isChecked.value;
  console.log(isChecked.value);
  saveSession(isChecked.value, email.value, password.value);
}

async function onClick() {
  const data = await login(email.value, password.value);
  console.log("登录", data);
  if (data) {
    router.push("/");
  }
}
</script>

<style scoped></style>
