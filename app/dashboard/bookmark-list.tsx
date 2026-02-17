"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Bookmark = {
    id: string;
    title: string;
    url: string;
    user_id: string;
    created_at: string;
};

export default function BookmarkList({
    initialBookmarks,
    userId,
}: {
    initialBookmarks: Bookmark[];
    userId: string;
}) {
    const supabase = createClient();
    const [bookmarks, setBookmarks] = useState(initialBookmarks);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

    // supabase real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel("bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        const newRec = payload.new as Bookmark;
                        setBookmarks((prev) =>
                            prev.some((b) => b.id === newRec.id) ? prev : [newRec, ...prev]
                        );
                    } else if (payload.eventType === "DELETE") {
                        const oldRec = payload.old as Bookmark;
                        setBookmarks((prev) => prev.filter((b) => b.id !== oldRec.id));
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [userId, supabase]);

    // INSERT
    const addBookmark = async () => {
        if (!title || !url) return;

        await supabase.from("bookmarks").insert([
            {
                title,
                url,
                user_id: userId,
            },
        ]);

        setTitle("");
        setUrl("");
    };

    // DELETE
    const deleteBookmark = async (id: string) => {
        const { error } = await supabase.from("bookmarks").delete().eq("id", id);
        if (!error) {
            setBookmarks((prev) => prev.filter((b) => b.id !== id));
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <input
                    placeholder="Title"
                    className="border p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="URL"
                    className="border p-2"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button
                    onClick={addBookmark}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-95"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {bookmarks.map((b) => (
                    <li
                        key={b.id}
                        className="flex justify-between border p-2"
                    >
                        <a href={b.url} target="_blank" className="hover:underline">
                            {b.title}
                        </a>

                        <button onClick={() => deleteBookmark(b.id)} className="text-destructive">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
