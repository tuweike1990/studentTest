<template>
  <main
    class="flex flex-col items-center justify-center min-h-screen text-center"
  >
    <!-- <h1>未找到页面</h1> -->
    <button class="btn btn-primary btn-lg mt-4" @click="() => router.push('/')">
      返回首页
    </button>
  </main>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>
