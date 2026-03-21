begin;

alter table if exists public.leads enable row level security;

revoke all on table public.leads from anon, authenticated;

drop policy if exists leads_deny_anon_authenticated on public.leads;
create policy leads_deny_anon_authenticated
  on public.leads
  for all
  to anon, authenticated
  using (false)
  with check (false);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'leads'
      and column_name = 'name'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'leads_name_length_chk'
  ) then
    alter table public.leads
      add constraint leads_name_length_chk
      check (char_length(name) between 1 and 100);
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'leads'
      and column_name = 'company'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'leads_company_length_chk'
  ) then
    alter table public.leads
      add constraint leads_company_length_chk
      check (company is null or char_length(company) <= 100);
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'leads'
      and column_name = 'message'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'leads_message_length_chk'
  ) then
    alter table public.leads
      add constraint leads_message_length_chk
      check (char_length(message) between 1 and 2000);
  end if;
end $$;

commit;

