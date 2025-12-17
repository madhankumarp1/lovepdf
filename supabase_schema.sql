-- 1. Create a bucket for user files (Safe to run multiple times)
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', true)
on conflict (id) do nothing;

-- 2. Storage Policies (Drop first to avoid duplicates)
drop policy if exists "Authenticated users can upload files" on storage.objects;
create policy "Authenticated users can upload files"
  on storage.objects for insert
  with check ( bucket_id = 'user-files' and auth.role() = 'authenticated' );

drop policy if exists "Authenticated users can read files" on storage.objects;
create policy "Authenticated users can read files"
  on storage.objects for select
  using ( bucket_id = 'user-files' and auth.role() = 'authenticated' );
  
-- 3. Create 'files' table (Safe to run multiple times)
create table if not exists public.files (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  url text not null,
  size bigint,
  type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS
alter table public.files enable row level security;

-- 5. File Policies (Drop first to avoid duplicates)
drop policy if exists "Users can view their own files" on public.files;
create policy "Users can view their own files"
  on public.files for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert their own files" on public.files;
create policy "Users can insert their own files"
  on public.files for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can delete their own files" on public.files;
create policy "Users can delete their own files"
  on public.files for delete
  using ( auth.uid() = user_id );
