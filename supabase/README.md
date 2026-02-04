# Supabase Setup

## Running the migration

To create the `profiles` table and trigger for syncing new users:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Open **SQL Editor**
4. Copy the contents of `migrations/20250126000000_create_profiles.sql`
5. Paste and run the SQL

Alternatively, if you use the Supabase CLI:

```bash
supabase db push
```

## What the migration does

- Creates a `public.profiles` table with: `id`, `email`, `full_name`, `avatar_url`, `created_at`, `updated_at`
- Enables Row Level Security (RLS) so users can only view/update their own profile
- Creates a trigger `on_auth_user_created` that automatically inserts a new row into `profiles` when a user signs up via `auth.users`
