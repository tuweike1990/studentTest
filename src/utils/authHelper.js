import { getCurrentUser } from "@/services/apiAuth";

export async function isAuthemsicated() {
  const user = await getCurrentUser();
  if (user) {
    return true;
  }
  return false;
}
