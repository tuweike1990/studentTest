import { faker } from "@faker-js/faker";
import { supabase } from "@/utils/supabase.js";

export async function getStudentList(teacherId) {
  const { data: student, error } = await supabase
    .from("student")
    .select("*")
    .eq("teacher_id", teacherId);

  if (error) {
    console.log(error.message);
    return;
  }
  return student;
}

export async function countStudentList(teacherId) {
  const { count, error } = await supabase
    .from("student")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", teacherId);

  if (error) {
    console.log(error.message);
    return;
  }
  return count;
}

export async function getStudentListWidthLimit(
  teacherId,
  currentPage,
  pageSize,
) {
  const { data: student, error } = await supabase
    .from("student")
    .select("*")
    .eq("teacher_id", teacherId)
    .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

  if (error) {
    console.log(error.message);
    return;
  }
  return student;
}

export function generateStudent() {
  const classNum = faker.number.int({ min: 1, max: 5 });
  const grade = faker.number.int({ min: 1, max: 12 });
  const teacherId = faker.number.int({ min: 1, max: 11 });

  return {
    name: faker.person.fullName(), // 使用 faker 生成随机全名
    class: classNum,
    grade: grade,
    teacher_id: teacherId,
    gender: faker.person.sex(),
    avatar: faker.image.avatar(),
  };
}

export function generateStudents(count = 5) {
  return new Array(count).fill(null).map(generateStudent);
}

export async function insertStudents(count = 5) {
  const students = generateStudents(count);
  const { data, error } = await supabase
    .from("student")
    .insert(students)
    .select();

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

export async function createStudent(newStudentData) {
  const { data, error } = await supabase
    .from("student")
    .insert([newStudentData])
    .select();

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

//  通过学生ID获取学生信息
export async function getStudentByStudentId(studentId) {
  const { data: students, error } = await supabase
    .from("student")
    .select("*")
    .eq("student_id", studentId);

  if (error) {
    console.log(error.message);
    return;
  }
  return students[0];
}

export async function updateStudent(studentId, newStudentData) {
  const { data, error } = await supabase
    .from("student")
    .update(newStudentData)
    .eq("student_id", studentId)
    .select();

  if (error) {
    console.log(error.message);
    return;
  }

  return data;
}

//删除学生信息

export async function deleteStudent(studentId) {
  const { error } = await supabase
    .from("student")
    .delete()
    .eq("student_id", studentId);
}
