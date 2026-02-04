# Supabase Setup

## Running the migrations

Run migrations in order:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Open **SQL Editor**
4. Run each migration file in order:
   - `migrations/20250126000000_create_profiles.sql`
   - `migrations/20250126100000_create_presets.sql`
   - `migrations/20250126200000_create_avatars_bucket.sql`

Alternatively, if you use the Supabase CLI:

```bash
supabase db push
```

## Migration 1: Profiles

- Creates a `public.profiles` table with: `id`, `email`, `full_name`, `avatar_url`, `created_at`, `updated_at`
- Enables Row Level Security (RLS) so users can only view/update their own profile
- Creates a trigger `on_auth_user_created` that automatically inserts a new row into `profiles` when a user signs up via `auth.users`

## Migration 2: Presets

- Creates a `public.presets` table with: `id`, `user_id`, `model_id`, `name`, `values` (JSONB), `is_favorite`, `created_at`, `updated_at`
- Enables RLS so users can only CRUD their own presets

## Migration 3: Avatars Storage

- RLS policies for `storage.objects` (avatars bucket)
- **Before running:** Create the bucket in Supabase Dashboard: Storage > New bucket > id: `avatars`, Public: true, File size limit: 1MB
