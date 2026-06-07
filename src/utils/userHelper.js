import { getConfig } from "./configHelper";

export function getUserId() {
  const token = getConfig("SUPABASE_TOKEN");
  const userToken = JSON.parse(localStorage.getItem(token));
  //const supabaseUrl = getConfig("SUPABASE_URL");
  return userToken?.user?.id || "NOT FOUND";
}
