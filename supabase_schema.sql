-- Create a bucket for user files
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', true);

-- Policy to allow authenticated users to upload files to their own folder (essentially)
-- Actually for simplicity, we allow auth users to upload, and we'll check ownership in DB
-- storage.objects policies are tricky, let's keep it simple for now: valid users can upload.
create policy "Authenticated users can upload files"
  on storage.objects for insert
  with check ( bucket_id = 'user-files' and auth.role() = 'authenticated' );

create policy "Authenticated users can read files"
  on storage.objects for select
  using ( bucket_id = 'user-files' and auth.role() = 'authenticated' );
  
-- Create files table
create table public.files (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  url text not null,
  size bigint,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for files table
alter table public.files enable row level security;

create policy "Users can view their own files"
  on public.files for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own files"
  on public.files for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own files"
  on public.files for delete
  using ( auth.uid() = user_id );
