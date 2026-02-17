"use client";

import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
      <main className="flex items-center justify-center h-screen">
        <button
            onClick={handleLogin}
            className="bg-black text-white px-6 py-3 rounded"
        >
          Sign in with Google
        </button>
      </main>
  );
}
