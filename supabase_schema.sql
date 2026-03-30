-- Supabase 히스토리 테이블 생성
-- Supabase 대시보드 > SQL Editor에서 실행하세요

create table if not exists pension_history (
  id          uuid        default gen_random_uuid() primary key,
  device_id   text        not null,
  label       text        not null,
  inputs      jsonb       not null,
  created_at  timestamptz default now()
);

-- 최신순 조회 성능을 위한 인덱스
create index if not exists pension_history_device_created
  on pension_history (device_id, created_at desc);

-- Row Level Security 활성화
alter table pension_history enable row level security;

-- 누구나 삽입 허용 (device_id 기반 익명 사용)
create policy "allow_insert" on pension_history
  for insert with check (true);

-- 누구나 자신의 device_id 데이터 조회 허용
create policy "allow_select" on pension_history
  for select using (true);

-- 누구나 삭제 허용
create policy "allow_delete" on pension_history
  for delete using (true);
