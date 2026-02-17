"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="px-6 py-3 rounded bg-primary text-primary-foreground hover:opacity-90"
        >
            Log in with Google
        </button>
    );
}
