import { ref } from "vue";
import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", () => {
  const searchKeyword = ref("");
  const currentPage = ref("");

  console.log(searchKeyword.value, currentPage.value);
  function clear() {
    searchKeyword.value = "";
    currentPage.value = "";

    console.log(searchKeyword.value, currentPage.value);
  }

  function setSearchKeyword(keyword) {
    console.log("pina获取到的关键词", keyword);
    searchKeyword.value = keyword.trim();
  }

  function resetPage(page) {
    currentPage.value = page;
  }

  return {
    searchKeyword,
    currentPage,
    setSearchKeyword,
    resetPage,
    clear,
  };
});
