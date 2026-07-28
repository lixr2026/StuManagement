-- 学生信息管理系统 数据库脚本
-- 库名: usermanagement
-- 在 Supabase SQL Editor 中执行本脚本即可创建所需表结构与初始管理员账号

-- 启用 pgvector 扩展（按需求预留，本系统暂未使用）
create extension if not exists vector;

-- 管理员表（登录账号）
create table if not exists public.admin (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null  -- 明文存储起步，后续可升级为 bcrypt
);

-- 学生信息表
create table if not exists public.student (
  id uuid primary key default gen_random_uuid(),
  student_no text not null,                 -- 学号
  name text not null,                       -- 姓名
  gender text,                              -- 性别
  class text,                               -- 班级
  phone text,                               -- 电话
  remark text,                              -- 备注
  created_at timestamptz not null default now()
);

-- 模糊查询索引
create index if not exists idx_student_student_no on public.student (student_no);
create index if not exists idx_student_name on public.student (name);
create index if not exists idx_student_class on public.student (class);

-- 初始管理员账号 (用户名: admin / 密码: admin)，可按需修改
insert into public.admin (username, password)
values ('admin', 'admin')
on conflict (username) do nothing;