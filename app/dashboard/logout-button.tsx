"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-destructive text-destructive-foreground hover:opacity-90"
        >
            Sign Out
        </button>
    );
}
