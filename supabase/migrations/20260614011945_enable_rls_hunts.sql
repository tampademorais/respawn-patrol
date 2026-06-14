alter table public.hunts enable row level security;

create policy "Allow public read hunts"
on public.hunts
for select
to anon
using (true);