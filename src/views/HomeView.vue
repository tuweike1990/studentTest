<template>
  <NavBar />
  <ToolBarSearch v-show="routerName === 'score' || routerName === 'student'" />
  <RouterView />
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import NavBar from "./NavBar.vue";
import ToolBarSearch from "./ToolBarSearch.vue";
const route = useRoute();
const routerName = computed(() => route.name);
</script>
