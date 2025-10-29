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

## Supabase Setup Summary

Tables expected:
- recipes
  - id: uuid (primary key, default uuid_generate_v4())
  - title: text
  - image_url: text
  - cuisine: text
  - tags: text[] (array)
  - ingredients: text[] (array)
  - instructions: text[] (array)
  - created_at: timestamp with time zone (default now())

- profiles
  - id: uuid (primary key) references auth.users
  - username: text
  - avatar_url: text
  - updated_at: timestamp with time zone

- favorites
  - user_id: uuid references auth.users
  - recipe_id: uuid references recipes.id
  - unique constraint: (user_id, recipe_id)

Policies (suggested):
- profiles: user can read all, update own row (id = auth.uid())
- favorites: user can select/insert/delete where user_id = auth.uid()
- recipes: read-only for anon/auth (as desired)

Auth:
- OTP email sign-in using Supabase Auth
- Redirect uses REACT_APP_SITE_URL

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
