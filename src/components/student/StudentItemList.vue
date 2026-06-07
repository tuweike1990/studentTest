<template>
  <tr v-for="student in studentList" :key="student.id">
    <!-- <th>
      <label>
        <input type="checkbox" class="checkbox" />
      </label>
    </th> -->
    <td>
      <div class="flex items-center gap-3">
        <div class="avatar">
          <div class="mask mask-squircle h-12 w-12">
            <img :src="student.avatar" />
          </div>
        </div>
        <!--name and -->
        <div>
          <div class="font-bold">{{ student.name }}</div>
          <div class="text-sm opacity-50">
            {{ student.gender === "male" ? "男" : "女" }}
          </div>
        </div>
      </div>
    </td>
    <td>
      {{ student.grade }}
    </td>
    <td>{{ student.class }}</td>
    <!-- <td>
      <span class="badge badge-ghost badge-sm">{{ student.teacherName }}</span>
    </td> -->
    <th>
      <button
        class="btn btn-ghost btn-sm"
        @click="
          () =>
            router.push({
              name: 'studentEdit',
              params: { id: student.student_id },
            })
        "
      >
        编辑
      </button>
      <button class="btn btn-error btn-sm" @click="onClick(student.student_id)">
        删除
      </button>
    </th>
  </tr>
</template>

<script setup>
import { useRouter } from "vue-router";
import { deleteStudent } from "@/services/apiStudent";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const emit = defineEmits(["refresh"]);

defineProps(["studentList"]);

async function onClick(studentId) {
  // console.log("删除学生", studentId);

  if (confirm("确定要删除吗？")) {
    // 用户点“确定”

    await deleteStudent(studentId);
    toast.success("删除成功");
    emit("refresh", 123);
  } else {
    // 用户点“取消”
    toast.error("取消删除");
  }
}
</script>

<style scoped></style>
