"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function PostRow({ post, onChanged, onDeleted, notify }) {
  const supabase = createClient();
  const replaceInputRef = useRef(null);

  const [caption, setCaption] = useState(post.caption || "");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  async function saveCaption() {
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });
      if (!res.ok) throw new Error("Could not save caption.");
      const { post: updated } = await res.json();
      onChanged(updated);
      setEditing(false);
      notify("Caption updated.", "success");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This can't be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete post.");
      onDeleted(post.id);
      notify("Post deleted.", "success");
    } catch (err) {
      notify(err.message, "error");
      setBusy(false);
    }
  }

  async function handleReplaceImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `posts/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("pixlyn")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("pixlyn").getPublicUrl(path);

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: publicUrl }),
      });
      if (!res.ok) throw new Error("Could not replace image.");
      const { post: updated } = await res.json();
      onChanged(updated);
      notify("Image replaced.", "success");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  return (
    <div className="flex gap-3 py-3 border-b border-hairline last:border-b-0">
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-subtle">
        <img
          src={post.image_url}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        {editing ? (
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
            className="w-full border border-hairline rounded-lg px-3 py-2 text-[13.5px] outline-none focus:border-ink resize-none"
          />
        ) : (
          <p className="text-[13.5px] text-ink line-clamp-2">
            {post.caption || (
              <span className="text-muted italic">No caption</span>
            )}
          </p>
        )}
        <p className="mt-1 text-[11.5px] text-muted">
          {formatDate(post.created_at)}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px]">
          {editing ? (
            <>
              <button
                onClick={saveCaption}
                disabled={busy}
                className="text-ink font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setCaption(post.caption || "");
                }}
                className="text-muted"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              disabled={busy}
              className="text-muted hover:text-ink transition-colors"
            >
              Edit caption
            </button>
          )}

          <label className="text-muted hover:text-ink transition-colors cursor-pointer">
            Replace image
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              onChange={handleReplaceImage}
              className="hidden"
            />
          </label>

          <button
            onClick={handleDelete}
            disabled={busy}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPostList({ posts, onChanged, onDeleted, notify }) {
  return (
    <div>
      <p className="text-[13px] font-semibold text-muted uppercase tracking-wide mb-1">
        Your posts ({posts.length})
      </p>
      {posts.length === 0 ? (
        <p className="text-[13.5px] text-muted py-6 text-center">
          No posts yet — publish your first one above.
        </p>
      ) : (
        posts.map((post) => (
          <PostRow
            key={post.id}
            post={post}
            onChanged={onChanged}
            onDeleted={onDeleted}
            notify={notify}
          />
        ))
      )}
    </div>
  );
    }
