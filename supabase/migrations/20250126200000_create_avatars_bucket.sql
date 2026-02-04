-- Storage bucket 'avatars' must be created in Supabase Dashboard:
-- Storage > New bucket > id: avatars, Public: true, File size limit: 1MB

-- RLS: Users can upload to their own folder (user_id/filename)
create policy "Users can upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS: Users can update their own avatar
create policy "Users can update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS: Public read (bucket is public)
create policy "Avatar images are publicly accessible"
on storage.objects for select
to public
using (bucket_id = 'avatars');
