"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UploadForm({ onPublished, notify }) {
  const supabase = createClient();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [likes, setLikes] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }
function resetForm() {
    setFile(null);
    setPreviewUrl(null);
    setCaption("");
    setLikes("");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
}
  

  async function handlePublish(e) {
    e.preventDefault();
    if (!file) {
      notify("Choose a photo first.", "error");
      return;
    }

    setBusy(true);
    setProgress(15);

    try {
      const ext = file.name.split(".").pop();
      const path = `posts/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("pixlyn")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;
      setProgress(65);

      const {
        data: { publicUrl },
      } = supabase.storage.from("pixlyn").getPublicUrl(path);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: publicUrl, caption, likes: likes || "0" }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to publish post.");
      }

      setProgress(100);
      const { post } = await res.json();
      onPublished(post);
      notify("Post published.", "success");
      resetForm();
    } catch (err) {
      notify(err.message || "Something went wrong.", "error");
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 400);
    }
  }

  return (
    <form
      onSubmit={handlePublish}
      className="border border-hairline rounded-2xl p-4 sm:p-5 flex flex-col gap-4"
    >
      <p className="text-[13px] font-semibold text-muted uppercase tracking-wide">
        New post
      </p>

      <label
        htmlFor="file-upload"
        className="cursor-pointer border border-dashed border-hairline rounded-xl overflow-hidden flex items-center justify-center bg-subtle aspect-[4/3] relative"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Selected preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-[14px] text-muted px-4 text-center">
            Tap to choose a photo
          </span>
        )}
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <textarea
        placeholder="Write a caption…"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={3}
        className="w-full border border-hairline rounded-xl px-4 py-3 text-[14.5px] outline-none focus:border-ink transition-colors resize-none"
      />
       <input
        type="text"
        placeholder="Likes (e.g. 292k) — optional"
        value={likes}
        onChange={(e) => setLikes(e.target.value)}
        className="w-full border border-hairline rounded-xl px-4 py-3 text-[14.5px] outline-none focus:border-ink transition-colors"
      />   

      {progress > 0 && (
        <div className="w-full h-1.5 bg-hairline rounded-full overflow-hidden">
          <div
            className="h-full bg-ink transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="bg-ink text-white rounded-xl py-3 text-[14.5px] font-semibold disabled:opacity-50 active:opacity-80 transition-opacity"
      >
        {busy ? "Publishing…" : "Publish post"}
      </button>
    </form>
  );
              }
