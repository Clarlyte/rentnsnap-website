-- Add void_amount column to rentals table
alter table rentals
add column if not exists void_amount decimal(10,2) default null;

-- Update RLS policies to include void_amount
create policy "Enable read void_amount for authenticated users" on rentals
  for select using (auth.role() = 'authenticated');

create policy "Enable update void_amount for authenticated users" on rentals
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated'); 