-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  name text,
  avatar_url text,
  role text default 'citizen' check (role in ('citizen', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on profiles for update using (auth.uid() = id);

-- PROJECTS TABLE
create table projects (
  id uuid default uuid_generate_v4() primary key,
  slug text unique, -- For URL friendly IDs if needed, or use ID
  title text not null,
  description text,
  content text,
  image_url text,
  category text,
  status text default 'planned',
  location_lat float,
  location_lng float,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  votes_count integer default 0
);

-- RLS for Projects
alter table projects enable row level security;
create policy "Projects are viewable by everyone." on projects for select using (true);
create policy "Admins can insert projects." on projects for insert with check (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can update projects." on projects for update using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can delete projects." on projects for delete using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- VOTES TABLE
create table votes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, project_id)
);

-- RLS for Votes
alter table votes enable row level security;
create policy "Votes are viewable by everyone." on votes for select using (true);
create policy "Users can insert their own votes." on votes for insert with check (auth.uid() = user_id);
create policy "Users can delete their own votes." on votes for delete using (auth.uid() = user_id);

-- FUNCTION TO HANDLE NEW USER SIGNUP
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'citizen', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- TRIGGER FOR NEW USER
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
