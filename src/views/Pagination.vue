<template>
  <div class="join flex items-center justify-center">
    <button
      v-for="(_, i) in new Array(pageCount)"
      :key="index"
      :class="`join-item btn ${i + 1 == currentPage ? 'btn-disabled' : ''}`"
      @click="handleChangePage(i + 1)"
    >
      {{ i + 1 }}
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
defineProps(["currentPage", "pageCount"]);

const router = useRouter();

function handleChangePage(page) {
  router.push({ query: { page } });
}
</script>
