"use client";

import { useState, useCallback } from "react";
import UploadForm from "./UploadForm";
import AdminPostList from "./AdminPostList";
import ProfileEditor from "./ProfileEditor";
import Toast from "./Toast";
import LogoutButton from "./LogoutButton";

export default function AdminDashboard({ initialPosts, initialProfile }) {
  const [posts, setPosts] = useState(initialPosts);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 3000);
  }, []);

  function handlePublished(newPost) {
    setPosts((prev) => [newPost, ...prev]);
  }
  function handleChanged(updated) {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }
  function handleDeleted(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-handwritten text-4xl text-ink">Pixlyn admin</h1>
          <LogoutButton />
        </div>

        
          href="/"
          target="_blank"
          rel="noreferrer"
          className="text-[13px] text-muted hover:text-ink -mt-3 transition-colors"
        >
          View public profile ↗
        </a>

        <UploadForm onPublished={handlePublished} notify={notify} />

        <ProfileEditor initialProfile={initialProfile} notify={notify} />

        <AdminPostList
          posts={posts}
          onChanged={handleChanged}
          onDeleted={handleDeleted}
          notify={notify}
        />
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ message: "", type: toast.type })}
      />
    </main>
  );
}
