# Recipe Explorer Frontend

A modern React app to browse, search, and manage recipes with Supabase auth and favorites.

## Quick Start

1. Install dependencies:
   - npm install

2. Create a .env file at recipe_frontend with:
   - See .env.example for required variables
   - REACT_APP_SUPABASE_URL=
   - REACT_APP_SUPABASE_KEY=
   - REACT_APP_SITE_URL=http://localhost:3000

3. Start the app:
   - npm start
   - Open http://localhost:3000

If Supabase env vars are missing, a red banner will appear guiding you to configure them.

## Supabase Setup (Schema + Policies)

Use the SQL below in Supabase SQL Editor (or see assets/supabase.md for a copy):

- Creates tables: recipes, profiles, favorites
- Enables RLS and defines policies:
  - recipes: public read
  - profiles: read all; insert/update own row (id = auth.uid())
  - favorites: select/insert/delete only when user_id = auth.uid()

-- Begin SQL (run in Supabase) --
create extension if not exists pgcrypto;

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  cuisine text,
  tags text[],
  ingredients text[],
  instructions text[],
  created_at timestamptz default now() not null
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  updated_at timestamptz
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (user_id, recipe_id)
);

alter table public.recipes enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

create policy recipes_read_all on public.recipes
  for select using (true);

create policy profiles_read_all on public.profiles
  for select using (true);

create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = id);

create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy favorites_select_own on public.favorites
  for select using (auth.uid() = user_id);

create policy favorites_insert_own on public.favorites
  for insert with check (auth.uid() = user_id);

create policy favorites_delete_own on public.favorites
  for delete using (auth.uid() = user_id);
-- End SQL --

Post-setup checklist:
- Authentication > URL Configuration:
  - Site URL: http://localhost:3000 (dev) or your production domain
  - Redirect URLs: add http://localhost:3000/** and your production domain /**
- Providers > Email: Ensure Email OTP is enabled
- Optional: Seed a few recipes to test favorites and browsing.

## Features

- Ocean Professional theme (blue/amber accents)
- Email OTP login, profile editing (username, avatar url)
- Search with debounce, filters (cuisine, tags), sort options
- Recipe details page with ingredients and instructions
- Favorites with optimistic toggling and sidebar panel
- Responsive layout with sticky navbar and sidebar

## Scripts

- npm start - Start dev server
- npm test - Run tests
- npm run build - Production build

## Environment Variables

- REACT_APP_SUPABASE_URL: Supabase Project URL
- REACT_APP_SUPABASE_KEY: Supabase anon public key
- REACT_APP_SITE_URL: Site URL for auth callbacks (http://localhost:3000 in dev)

Tip: Copy .env.example to .env and fill in values.

## Notes

- When DB is empty, Home page gracefully shows helpful message.
- Favorites rely on RLS policies in Supabase to constrain operations to the current user.
