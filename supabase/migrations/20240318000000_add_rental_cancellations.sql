-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create the rental_cancellations table
create table if not exists rental_cancellations (
  cancellation_id uuid default uuid_generate_v4() primary key,
  rental_id uuid references rentals(rental_id) on delete cascade,
  void_amount decimal(10,2) not null,
  reason text,
  cancelled_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table rental_cancellations enable row level security;

create policy "Enable read access for authenticated users" on rental_cancellations
  for select using (auth.role() = 'authenticated');

create policy "Enable insert access for authenticated users" on rental_cancellations
  for insert with check (auth.role() = 'authenticated');

-- Create function to update timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add trigger for updated_at
create trigger set_updated_at
    before update on rental_cancellations
    for each row
    execute function update_updated_at_column(); 