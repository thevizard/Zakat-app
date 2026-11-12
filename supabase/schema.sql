-- Supabase SQL Migration for Zakatly Annual History & Payment Tracker
-- Run this in your Supabase SQL Editor when connecting your project.

create table if not exists public.zakat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  gregorian_year integer not null,
  hawl_due_date date not null,
  nisab_standard text check (nisab_standard in ('gold', 'silver')) not null default 'gold',
  total_assets numeric not null default 0,
  total_liabilities numeric not null default 0,
  zakatable_wealth numeric not null default 0,
  nisab_threshold numeric not null default 0,
  meets_nisab boolean not null default false,
  zakat_due numeric not null default 0,
  paid_amount numeric not null default 0,
  notes text,
  breakdown jsonb not null default '[]'::jsonb
);

alter table public.zakat_history enable row level security;

create policy "Users can view their own zakat history"
  on public.zakat_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own zakat history"
  on public.zakat_history for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own zakat history"
  on public.zakat_history for update
  using (auth.uid() = user_id);

create policy "Users can delete their own zakat history"
  on public.zakat_history for delete
  using (auth.uid() = user_id);
