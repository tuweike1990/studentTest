import { faker, fakerEL } from "@faker-js/faker";
import { supabase } from "@/utils/supabase.js";
const data = [
  {
    id: 1,
    name: "张三",
    sex: "男",
    class: "一年级1班",
    teacherName: "数学",
  },
];
export async function getStudentList() {
  // return data.map((item) => {
  //   return {
  //     ...item,
  //     avatar: faker.image.avatar(),
  //   };
  // });

  let { data: student, error } = await supabase.from("student").select("*");
  console.log("调取", student);
  if (error) {
    console.log(error.message);
    return;
  }
  return student;
}
