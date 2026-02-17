# Smart Bookmark

## Project overview
Small bookmark manager implemented with Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.

This README documents how to run locally, Supabase table/policy setup, and how to deploy to Vercel.

---

## Quick Start (local)

- Create `.env.local` in project root with the following values:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-or-publishable-key>
```

- Install and run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000


## Supabase setup (tables and RLS)

Run these SQL snippets in the Supabase SQL editor to create the `bookmarks` table and policies:

```sql
create table public.bookmarks (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	url text not null,
	user_id uuid not null,
	created_at timestamptz default now()
);

create index if not exists idx_bookmarks_user_id on public.bookmarks (user_id);

-- Row Level Security
alter table public.bookmarks enable row level security;

create policy "insert_bookmark" on public.bookmarks
	for insert using (auth.role() = 'authenticated') with check (user_id = auth.uid());

create policy "select_own" on public.bookmarks
	for select using (user_id = auth.uid());

create policy "delete_own" on public.bookmarks
	for delete using (user_id = auth.uid());
```

In Supabase Auth settings add redirect URLs for development and production, for example:

```
http://localhost:3000/
https://your-app.vercel.app/
```


## Deploy to Vercel

1. Push this repo to Git (GitHub, GitLab or similar) and import the project in Vercel.
2. In Vercel Project Settings > Environment Variables, set:
	 - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
	 - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon/publishable key
	 - (Optional) `SUPABASE_SERVICE_ROLE_KEY` = service role key (server-only)
3. Deploy. Vercel will run the Next.js build automatically.


## How it works — technical summary

- **Auth flow:** Client uses `createBrowserClient().auth.signInWithOAuth({provider: 'google'})` to start OAuth. After redirect back the client listens for `onAuthStateChange` and navigates to `/dashboard`.
- **Server auth:** Server components use `createServerClient(...)` (in `lib/supabase/server.ts`) and `supabase.auth.getUser()` to authenticate and fetch the current user. Heavy runtime data access is wrapped in `<Suspense>` to avoid blocking navigations.
- **Data model:** Bookmarks table stores `user_id` (auth UID) per record; server queries include `.eq('user_id', user.id)` so users only receive their own bookmarks.
- **Realtime:** `app/dashboard/bookmark-list.tsx` subscribes to `postgres_changes` filtered by `user_id` so inserts/deletes are pushed to all tabs.


## Useful commands

```bash
# dev
npm run dev
# build
npm run build
# start
npm run start
```

---

If you want, I can add a small deploy checklist and a Vercel `Environment` template, or push a short `deploy.md` with screenshots. Let me know which you'd prefer.
