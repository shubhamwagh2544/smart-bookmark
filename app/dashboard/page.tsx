import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import BookmarkList from "./bookmark-list";
import LogoutButton from "./logout-button";

async function DashboardContent() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return <BookmarkList initialBookmarks={bookmarks ?? []} userId={user.id} />;
}

export default function Dashboard() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Bookmarks</h1>
                <LogoutButton />
            </div>
            <Suspense fallback={<div className="text-gray-500">Loading bookmarks...</div>}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}