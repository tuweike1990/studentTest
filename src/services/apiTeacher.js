import { faker } from "@faker-js/faker";
import { supabase } from "@/utils/supabase.js";

/*创建老师*/
export async function createTeacher(teacherData) {
  const { data, error } = await supabase.from("teacher").insert([teacherData]);
  // .select();

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

export async function getTeacherByTeacherId(teacherId) {
  const { data, error } = await supabase
    .from("teacher")
    .select("*")
    .eq("teacher_id", teacherId)
    .single(); // 只取一条

  if (error) {
    console.error("获取教师失败:", error.message);
    return null;
  }

  return data;
}

function generateClass() {
  const classNum = faker.number.int({ min: 1, max: 12 });
  const grade = faker.number.int({ min: 1, max: 12 });
  return `${classNum}|${grade}`;
}

export function generateTeacher() {
  const classCount = faker.number.int({ min: 1, max: 5 });

  const classIncharge = new Array(classCount)
    .fill(null)
    .map(() => generateClass());

  return {
    name: faker.person.fullName(), // 使用 faker 生成随机全名
    class_in_charge: JSON.stringify(classIncharge),
    gender: faker.person.sex(),
    avatar: faker.image.avatar(),
  };
}

export function generateTeachers(count = 5) {
  return new Array(count).fill(null).map(generateTeacher);
}

export async function insertTeachers(count = 5) {
  const teachers = generateTeachers(count);
  const { data, error } = await supabase
    .from("teacher")
    .insert(teachers)
    .select();

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}
