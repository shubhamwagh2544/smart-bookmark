"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/dashboard`,
            },
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="bg-black text-white px-6 py-3 rounded"
        >
            Sign in with Google
        </button>
    );
}