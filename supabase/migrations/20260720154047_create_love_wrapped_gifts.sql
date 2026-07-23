create extension if not exists pgcrypto;

create table public.gifts (
	id uuid primary key default gen_random_uuid(),
	owner_id uuid not null references auth.users (id) on delete cascade,
	share_token uuid not null unique default gen_random_uuid(),
	title text not null check (char_length(title) between 1 and 120),
	payload jsonb not null default '{}'::jsonb,
	asset_paths jsonb not null default '[]'::jsonb,
	spotify_uris jsonb not null default '[]'::jsonb,
	is_published boolean not null default false,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table public.gift_owners (
	user_id uuid primary key references auth.users(id) on delete cascade,
	created_at timestamptz not null default now()
);

alter table public.gift_owners enable row level security;

grant select on public.gift_owners to authenticated;

create policy "Owners can read their registration"
on public.gift_owners for select to authenticated
using ((select auth.uid()) = user_id);

create function public.is_gift_owner()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
	select exists (
		select 1
		from public.gift_owners
		where user_id = (select auth.uid())
	);
$$;

revoke all on function public.is_gift_owner() from public, anon;
grant execute on function public.is_gift_owner() to authenticated;

create index gifts_owner_id_idx on public.gifts (owner_id);
create index gifts_share_token_idx on public.gifts (share_token);

create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

create trigger gifts_set_updated_at
before update on public.gifts
for each row execute function public.set_updated_at();

alter table public.gifts enable row level security;

grant select, insert, update, delete on public.gifts to authenticated;

create policy "Owners can read their gifts"
on public.gifts for select to authenticated
using (public.is_gift_owner() and (select auth.uid()) = owner_id);

create policy "Owners can create their gifts"
on public.gifts for insert to authenticated
with check (public.is_gift_owner() and (select auth.uid()) = owner_id);

create policy "Owners can update their gifts"
on public.gifts for update to authenticated
using (public.is_gift_owner() and (select auth.uid()) = owner_id)
with check (public.is_gift_owner() and (select auth.uid()) = owner_id);

create policy "Owners can delete their gifts"
on public.gifts for delete to authenticated
using (public.is_gift_owner() and (select auth.uid()) = owner_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'gift-media',
	'gift-media',
	false,
	5242880,
	array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Owners can list their gift media"
on storage.objects for select to authenticated
using (
	bucket_id = 'gift-media'
	and public.is_gift_owner()
	and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Owners can upload their gift media"
on storage.objects for insert to authenticated
with check (
	bucket_id = 'gift-media'
	and public.is_gift_owner()
	and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Owners can update their gift media"
on storage.objects for update to authenticated
using (
	bucket_id = 'gift-media'
	and public.is_gift_owner()
	and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
	bucket_id = 'gift-media'
	and public.is_gift_owner()
	and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Owners can delete their gift media"
on storage.objects for delete to authenticated
using (
	bucket_id = 'gift-media'
	and public.is_gift_owner()
	and (storage.foldername(name))[1] = (select auth.uid()::text)
);

revoke execute on function public.set_updated_at() from public;
