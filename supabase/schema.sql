create extension if not exists pgcrypto;

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_user_id on conversations(user_id);
create index if not exists idx_messages_conversation_id on messages(conversation_id);

alter table conversations enable row level security;
alter table messages enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on conversations to authenticated;
grant select, insert on messages to authenticated;

drop policy if exists "users_can_select_own_conversations" on conversations;
drop policy if exists "users_can_insert_own_conversations" on conversations;
drop policy if exists "users_can_update_own_conversations" on conversations;
drop policy if exists "users_can_delete_own_conversations" on conversations;
drop policy if exists "users_can_select_own_messages" on messages;
drop policy if exists "users_can_insert_own_messages" on messages;

create policy "users_can_select_own_conversations"
  on conversations
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users_can_insert_own_conversations"
  on conversations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users_can_update_own_conversations"
  on conversations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_can_delete_own_conversations"
  on conversations
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "users_can_select_own_messages"
  on messages
  for select
  to authenticated
  using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and c.user_id = auth.uid()
    )
  );

create policy "users_can_insert_own_messages"
  on messages
  for insert
  to authenticated
  with check (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
        and c.user_id = auth.uid()
    )
  );
