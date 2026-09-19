"use client";

import { useState } from "react";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostCard({ post }) {
  const [loaded, setLoaded] = useState(false);

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
          <p className="text-[14.5px] leading-relaxed text-ink break-words">
            {post.caption}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-3 text-[12.5px] text-muted">
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          {typeof post.likes === "number" && post.likes > 0 && (
            <span className="flex items-center gap-1">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6Z" />
              </svg>
              {post.likes}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
