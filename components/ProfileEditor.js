"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

async function uploadImage(supabase, file, folder) {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("pixlyn")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from("pixlyn").getPublicUrl(path);
  return publicUrl;
}

export default function ProfileEditor({ initialProfile, notify }) {
  const supabase = createClient();
  const [profile, setProfile] = useState(
    initialProfile || { email: "", bio: "", avatar_url: "", banner_url: "" }
  );
  const [busy, setBusy] = useState(false);

  async function patchProfile(fields) {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || `Could not update profile (status ${res.status}).`); }
    const { profile: updated } = await res.json();
    setProfile(updated);
    return updated;
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(supabase, file, "avatars");
      await patchProfile({ avatar_url: url });
      notify("Profile picture updated.", "success");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleBannerChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(supabase, file, "banners");
      await patchProfile({ banner_url: url });
      notify("Banner updated.", "success");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveText(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await patchProfile({ email: profile.email, bio: profile.bio });
      notify("Profile saved.", "success");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-hairline rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <p className="text-[13px] font-semibold text-muted uppercase tracking-wide">
        Profile
      </p>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-subtle border border-hairline shrink-0">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <label className="text-[13px] text-ink font-semibold cursor-pointer border border-hairline rounded-lg px-3 py-2">
          Change avatar
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full h-20 rounded-lg overflow-hidden bg-subtle border border-hairline">
          {profile.banner_url && (
            <img
              src={profile.banner_url}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <label className="self-start text-[13px] text-ink font-semibold cursor-pointer border border-hairline rounded-lg px-3 py-2">
          Change banner
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
          />
        </label>
      </div>

      <form onSubmit={handleSaveText} className="flex flex-col gap-2.5">
        <input
          type="email"
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
          className="w-full border border-hairline rounded-xl px-4 py-2.5 text-[14.5px] outline-none focus:border-ink"
        />
        <textarea
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Bio"
          rows={3}
          className="w-full border border-hairline rounded-xl px-4 py-2.5 text-[14.5px] outline-none focus:border-ink resize-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="self-start bg-ink text-white rounded-xl px-5 py-2.5 text-[13.5px] font-semibold disabled:opacity-50"
        >
          Save profile
        </button>
      </form>
    </div>
  );
}
