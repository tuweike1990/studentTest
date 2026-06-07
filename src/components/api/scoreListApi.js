import { faker, fakerEL } from "@faker-js/faker";
import { supabase } from "@/utils/supabase.js";
const data = [
  {
    id: 1,
    name: "赵六",
    class: "一年级1班",
    subject: "物理",
    semester: "第一semester",
    score: 74,
  },
];
export async function getScoreList() {
  // return data;

  const { data: score, error } = await supabase.from("score").select("*");

  console.log("调取", score);
  if (error) {
    console.log(error);
  }
  return score;
}
