-- Create bookmarks table
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

-- Enable RLS
alter table public.bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using ( auth.uid() = user_id );

-- Create indexes
create index bookmarks_user_id_idx on public.bookmarks(user_id);
create index bookmarks_post_id_idx on public.bookmarks(post_id);
