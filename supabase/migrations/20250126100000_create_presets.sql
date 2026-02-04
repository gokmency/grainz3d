-- Create presets table
create table if not exists public.presets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  model_id text not null,
  name text not null,
  values jsonb default '{}' not null,
  is_favorite boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.presets enable row level security;

-- Policies: users can only CRUD their own presets
create policy "Users can view own presets"
  on public.presets for select
  using (auth.uid() = user_id);

create policy "Users can insert own presets"
  on public.presets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own presets"
  on public.presets for update
  using (auth.uid() = user_id);

create policy "Users can delete own presets"
  on public.presets for delete
  using (auth.uid() = user_id);

-- Index for faster lookups by user and model
create index if not exists presets_user_model_idx on public.presets(user_id, model_id);
