import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function requireUser(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function PATCH(request, { params }) {
  const supabase = createClient();
  const user = await requireUser(supabase);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json();
  const updates = {};
  if (typeof body.caption === "string") updates.caption = body.caption;
  if (typeof body.image_url === "string") updates.image_url = body.image_url;
  if (typeof body.likes === "string") updates.likes = body.likes;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data });
}

export async function DELETE(request, { params }) {
  const supabase = createClient();
  const user = await requireUser(supabase);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { error } = await supabase.from("posts").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
