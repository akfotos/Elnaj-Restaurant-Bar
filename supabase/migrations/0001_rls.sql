-- Supabase migration: role-based access control for storefront vs staff data.
-- Apply when migrating auth/DB to Supabase. Requires the Supabase Auth schema.

-- 1. Role enum
create type app_role as enum ('customer', 'kitchen', 'manager', 'admin');

-- 2. Profiles table extending auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'customer',
  full_name text,
  created_at timestamptz not null default now()
);

-- Helper: current user's role (avoids recursive RLS on profiles)
create or replace function public.current_role()
returns app_role
language sql stable security definer
set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

-- 3. Menu items
alter table public.menu_items enable row level security;

create policy "menu_items_public_read"
  on public.menu_items for select
  using (true);

create policy "menu_items_staff_write"
  on public.menu_items for all
  using (public.current_role() in ('admin', 'manager'))
  with check (public.current_role() in ('admin', 'manager'));

-- 4. Orders
alter table public.orders enable row level security;

create policy "orders_customer_read_own"
  on public.orders for select
  using (user_id = auth.uid() or public.current_role() in ('admin', 'manager', 'kitchen'));

create policy "orders_customer_insert_own"
  on public.orders for insert
  with check (user_id = auth.uid() or public.current_role() in ('admin', 'manager', 'kitchen'));

create policy "orders_staff_update"
  on public.orders for update
  using (public.current_role() in ('admin', 'manager', 'kitchen'))
  with check (public.current_role() in ('admin', 'manager', 'kitchen'));

-- 5. Profiles RLS: users read their own profile; staff read all
alter table public.profiles enable row level security;

create policy "profiles_read_own"
  on public.profiles for select
  using (id = auth.uid() or public.current_role() in ('admin', 'manager'));

-- Auto-create a profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
