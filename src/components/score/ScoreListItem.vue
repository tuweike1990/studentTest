<template>
  <tr>
    <td>{{ currentStudent.name }}</td>
    <td>{{ currentStudent.class }}</td>

    <td>{{ scoreItem.subject }}</td>
    <td>{{ scoreItem.semesterYear }}</td>
    <td>{{ scoreItem.score }}</td>

    <th v-if="!isStudent">
      <button
        class="btn btn-ghost btn-sm"
        @click="
          router.push({ name: 'scoreEdit', params: { id: scoreItem.id } })
        "
      >
        编辑
      </button>
      <button class="btn btn-error btn-sm" @click="onClick(scoreItem.id)">
        删除
      </button>
    </th>
  </tr>
</template>

<script setup>
import { useRouter } from "vue-router";
import { deleteScore } from "@/services/apiScore";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const router = useRouter();
const toast = useToast();
const emit = defineEmits(["refresh"]);
defineProps(["scoreItem", "currentStudent"]);

const userStore = useUserStore();
const { isStudent } = storeToRefs(userStore);

async function onClick(id) {
  //console.log(id);
  if (confirm("确定要删除吗？")) {
    // 用户点“确定”
    await deleteScore(id);
    toast.success("删除成功");
    // 刷新列表
    emit("refresh");
  } else {
    // 用户点“取消”
    toast.error("取消删除");
  }
}
</script>
