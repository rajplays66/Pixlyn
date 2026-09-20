import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = createClient();
  const body = await request.json();
  const { post_id, author, comment_body } = body;

  if (!post_id || !author || !comment_body) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id, author, body: comment_body })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
