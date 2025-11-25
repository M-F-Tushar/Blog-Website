-- Create comments table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Create policies
create policy "Comments are viewable by everyone"
  on public.comments for select
  using ( true );

create policy "Authenticated users can insert comments"
  on public.comments for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own comments"
  on public.comments for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own comments"
  on public.comments for delete
  using ( auth.uid() = user_id );

-- Create indexes
create index comments_post_id_idx on public.comments(post_id);
create index comments_user_id_idx on public.comments(user_id);
create index comments_parent_id_idx on public.comments(parent_id);
