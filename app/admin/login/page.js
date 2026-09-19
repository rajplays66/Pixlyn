"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <h1 className="font-handwritten text-5xl text-ink mb-8">Pixlyn</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-3"
      >
        <p className="text-center text-[13px] text-muted mb-1">
          Admin sign in
        </p>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-hairline rounded-xl px-4 py-3 text-[15px] outline-none focus:border-ink transition-colors"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-hairline rounded-xl px-4 py-3 text-[15px] outline-none focus:border-ink transition-colors"
        />

        {error && (
          <p className="text-[13px] text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full bg-ink text-white rounded-xl py-3 text-[15px] font-semibold transition-opacity disabled:opacity-50 active:opacity-80"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
            }
