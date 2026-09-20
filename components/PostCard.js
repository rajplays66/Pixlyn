"use client";

import { useState } from "react";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function PostCard({ post }) {
  const [loaded, setLoaded] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id, author: name.trim(), comment_body: text.trim() }),
      });
      if (res.ok) {
        const { comment } = await res.json();
        setComments((prev) => [...prev, comment]);
        setText("");
      }
    } finally {
      setBusy(false);
    }
  }

  const visibleComments = showAll ? comments : comments.slice(-2);

  return (
    <article className="group flex flex-col">
      <div className="relative w-full aspect-square overflow-hidden bg-subtle rounded-xl">
        {!loaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={post.image_url}
          alt={post.caption || "Post image"}
          onLoad={() => setLoaded(true)}
          className={`img-fade ${loaded ? "loaded" : ""} w-full h-full object-cover transition-transform duration-300 sm:group-hover:scale-[1.02]`}
          loading="lazy"
        />
      </div>

      <div className="mt-2.5 px-0.5">
        {post.caption && (
          <p className="text-[14.5px] leading-relaxed text-ink break-words">{post.caption}</p>
        )}

        <div className="mt-1.5 flex items-center gap-3 text-[12.5px] text-muted">
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          {post.likes && post.likes !== "0" && (
            <span className="flex items-center gap-1 text-red-500 font-medium">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6Z" />
              </svg>
              {post.likes}
            </span>
          )}
        </div>

        {comments.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {comments.length > 2 && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="text-[12.5px] text-muted self-start"
              >
                View all {comments.length} comments
              </button>
            )}
            {visibleComments.map((c) => (
              <p key={c.id} className="text-[13px] text-ink">
                <span className="font-semibold">{c.author}</span>{" "}
                <span className="text-muted">{c.body}</span>
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="mt-2 flex flex-col gap-1.5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-hairline rounded-lg px-3 py-1.5 text-[12.5px] outline-none focus:border-ink"
          />
          <div className="flex gap-1.5">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 border border-hairline rounded-lg px-3 py-1.5 text-[12.5px] outline-none focus:border-ink"
            />
            <button
              type="submit"
              disabled={busy}
              className="text-[12.5px] font-semibold text-ink px-3 disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
