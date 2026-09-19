import { createClient } from "@/lib/supabase/server";

export async function getPosts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, image_url, caption, likes, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPosts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProfile() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("getProfile error:", error.message);
    return null;
  }
  return data;
}
