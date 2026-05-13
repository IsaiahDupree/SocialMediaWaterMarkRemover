-- Create users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

-- Create customers table (Stripe customer mapping)
create table public.customers (
  id uuid references public.users on delete cascade not null primary key,
  stripe_customer_id text unique not null
);

alter table public.customers enable row level security;

create policy "Users can view their own customer data"
  on public.customers for select
  using (auth.uid() = id);

-- Create products table (Stripe products)
create table public.products (
  id text primary key,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- Create prices table (Stripe prices)
create table public.prices (
  id text primary key,
  product_id text references public.products,
  active boolean,
  description text,
  unit_amount bigint,
  currency text,
  type text,
  interval text,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb
);

alter table public.prices enable row level security;

create policy "Prices are viewable by everyone"
  on public.prices for select
  using (true);

-- Create subscriptions table (Stripe subscriptions)
create table public.subscriptions (
  id text primary key,
  user_id uuid references public.users not null,
  status text,
  metadata jsonb,
  price_id text references public.prices,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  ended_at timestamp with time zone,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Create watermark_jobs table
create table public.watermark_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  original_url text not null,
  processed_url text,
  status text default 'pending' not null,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

alter table public.watermark_jobs enable row level security;

create policy "Users can view their own jobs"
  on public.watermark_jobs for select
  using (auth.uid() = user_id);

create policy "Users can create their own jobs"
  on public.watermark_jobs for insert
  with check (auth.uid() = user_id);

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger to automatically create user profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create indexes for better performance
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists watermark_jobs_user_id_idx on public.watermark_jobs (user_id);
create index if not exists watermark_jobs_status_idx on public.watermark_jobs (status);
create index if not exists prices_product_id_idx on public.prices (product_id);
