# 学生信息管理系统

基于 Next.js 15 (App Router) + Shadcn UI + Tailwind CSS + Supabase (PostgreSQL) + Drizzle ORM 构建的学生信息管理系统。适配 PC 与移动端。

## 技术栈

| 类别 | 选型 |
|------|------|
| 前端框架 | Next.js 15（App Router、TS） |
| UI 组件 | Shadcn UI + Tailwind CSS |
| 数据库 | Supabase（PostgreSQL，预留 pgvector 扩展） |
| ORM | Drizzle ORM（postgres-js 直连） |
| 包管理 | npm |

## 已实现功能

- [x] **项目骨架（feat/scaffold）**：Next.js + Tailwind + Shadcn 基础组件 + Drizzle Schema + 数据库建库脚本
- [x] **登录功能（feat/login）**：首页登录页、`/api/login` 校验 admin 表、登录成功跳转 `/dashboard`、cookie 登录态、退出登录
- [x] **学生列表（feat/student-list）**：dashboard 展示学生信息表（学号/姓名/性别/班级/电话/备注），查询逻辑抽取到 `lib/student-query.ts`
- [x] **模糊搜索（feat/search）**：表格上方搜索框，按 学号/姓名/班级 ilike 模糊查询，URL `?q=` 驱动
- [x] **添加学生（feat/add-student）**：表格上方"添加学生"链接 → `/students/new` 填写表单 → 保存后返回 dashboard 并显示"添加学生信息成功"，表格自动刷新

> 后续功能随对应分支开发并合并后在此勾选更新。

## 项目结构

```
src/
  app/
    layout.tsx            # 根布局 + 全局样式
    page.tsx              # 首页（登录页）
    globals.css           # 主题与 Tailwind 样式
  components/ui/          # Shadcn 风格基础组件（button/input/card/table/label）
  db/
    index.ts              # Drizzle 客户端单例
    schema.ts             # admin / student 表定义
  lib/
    utils.ts              # cn 工具函数
supabase/schema.sql       # 建库建表 + 初始管理员脚本
drizzle.config.ts         # Drizzle Kit 配置
.env.local.example        # 环境变量示例
```

## 数据库说明

数据库名：`usermanagement`，包含两张表：

- `admin`：登录账号（username 唯一、password 明文存储起步，预留升级为 bcrypt）
- `student`：学生信息（学号、姓名、性别、班级、电话、备注、创建时间）

详见 `supabase/schema.sql`，在 Supabase SQL Editor 中执行即可创建表与初始账号 `admin / admin`。

## 环境变量

复制 `.env.local.example` 为 `.env.local` 并填写：

```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=postgresql://...
```

## 本地开发

```bash
npm install
# 在 Supabase 执行 supabase/schema.sql
npm run dev
```

打开 http://localhost:3000 访问。

## Git 工作流

每个功能在独立分支开发，确认后合并到 `main` 并推送到远程：

- `feat/scaffold` 项目初始化
- `feat/login` 登录功能
- `feat/student-list` 学生列表
- `feat/search` 模糊搜索
- `feat/add-student` 添加学生
- `feat/delete-student` 删除学生
- `feat/edit-student` 修改学生
- `feat/pagination` 分页导航