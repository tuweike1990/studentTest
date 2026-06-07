import { faker } from "@faker-js/faker";
import { supabase } from "@/utils/supabase.js";

export async function getScoreList() {
  const { data: score, error } = await supabase.from("score").select("*");

  if (error) {
    console.log(error.message);
    return;
  }
  return score;
}

export async function createScore(newScoreData) {
  const { data, error } = await supabase
    .from("score")
    .insert([newScoreData])
    .select();

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

// 通过学生ID获取学生分数信息
export async function getScoreByScoreId(scoreId) {
  const { data: scores, error } = await supabase
    .from("score")
    .select("*")
    .eq("id", scoreId);

  if (error) {
    console.log(error.message);
    return;
  }
  return scores[0];
}

//更新分数

export async function updateScore(scoreId, newScoreData) {
  // 使用supabase更新学生分数数据并获取更新后的结果
  const { data, error } = await supabase
    .from("score") // 指定操作的数据表为"score"
    .update(newScoreData) // 更新数据为newScoreData对象
    .eq("id", scoreId) // 添加条件，只更新student_id匹配的记录
    .select(); // 选择并返回更新后的数据

  // 检查更新操作是否出错
  if (error) {
    console.log(error.message); // 如果出错，打印错误信息
    return; // 终函数执行
  }
  return data; // 返回更新后的数据
}

//删除分数

export async function deleteScore(scoreId) {
  const { error } = await supabase.from("score").delete().eq("id", scoreId);

  if (error) {
    console.error(error.message);
    throw error;
  }
}
