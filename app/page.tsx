import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginButton from "./login-button";

async function HomeContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginButton />;
}

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Suspense fallback={<div className="text-gray-500">Checking session...</div>}>
        {/* runtime data access moved into HomeContent (async server component) */}
        <HomeContent />
      </Suspense>
    </main>
  );
}
