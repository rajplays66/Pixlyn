import { createClient } from "@/lib/supabase/server";

export async function getPosts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, image_url, caption, likes, created_at, updated_at, comments(id, author, body, created_at)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPosts error:", error.message);
    return [];
  }
  return (data ?? []).map((p) => ({
    ...p,
    comments: (p.comments || []).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    ),
  }));
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
