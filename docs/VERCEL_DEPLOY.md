# Vercel 部署指南

本文档说明把学生信息管理系统部署到 Vercel、并连接 Supabase 远端数据库所需的全部配置。

## 1. 前置条件

- GitHub 仓库已就绪（本项目 `lixr2026/StuManagement`）
- 一个 Supabase 项目（数据库名空间 `usermanagement` 的 `admin`、`student` 表已建好）
- 一个 Vercel 账号

## 2. 导入项目到 Vercel

1. 登录 https://vercel.com → **Add New… → Project**
2. 选择 GitHub 仓库 `StuManagement` 并 Import
3. Framework Preset 自动识别为 **Next.js**，保持默认即可
4. 暂**先不要点 Deploy**，进入下一步配置环境变量后再构建

## 3. 必须配置的环境变量（关键）

在 Vercel 项目的 **Settings → Environment Variables** 中添加下列变量。生产与预览环境都要配（或勾选所有 Environment）。

| 变量名 | 是否必需 | 说明 |
|--------|---------|------|
| `DATABASE_URL` | ✅ 必需 | Supabase 连接串。**务必使用 Session-mode / Direct 连接，端口 `5432` 或 pooler 的 `5432`**，不要用 transaction pooler 的 6543。形如：`postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ 必需 | `https://[ref].supabase.co`（本系统目前主要走 Drizzle 直连，此项作扩展预留） |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ 必需 | Supabase 的 service_role 密钥（Settings → API → service_role key） |
| `AUTH_SECRET` | ✅ 建议设置 | 用于 HMAC 签名登录 cookie 的密钥，请用一段随机长字符串（如 `openssl rand -hex 32` 生成）。若未设置会回退到 service key |

> **提醒**：本项目已在 `src/db/index.ts` 设置 `ssl: "require"`、`prepare: false`、`max: 3`，适配 Vercel serverless。无需额外改动。

### 关于连接串端口选择

Vercel serverless 函数与数据库之间是短连接、高并发冷启动，建议：

- **推荐 Session-mode pooler（端口 5432）**：`postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
  - 适合 supavisor，连接复用好，与 `prepare:false` 配合无问题
- 直接连 `db.[ref].supabase.co:5432` 也可，但连接数有限，serverless 下不建议
- **避免使用 6543（transaction pooler）**：长事务/会话变量受限。本地开发用过没问题，但生产建议换 5432

> 如果你 Supabase 项目面板里“Connection string”给的就是 6543/Session holster，请在 Supabase → Database → Connection string 切到 “Session pooler” 或 “Direct connection” 复制对应串。

## 4. Supabase 设置（确保 Vercel IP 能访问）

1. Supabase → **Project Settings → Database → Network restrictions**：如果开了 IP 白名单，需允许 Vercel 的出网 IP，或暂时设为 `0.0.0.0/0`（注意安全风险，建议完成后收紧）。
2. 确认已在 SQL Editor 执行过 `supabase/schema.sql`（表 `admin`、`student` 与初始账号 `admin/admin` 已存在）。表结构本地与 Vercel 共用同一数据库，无需再跑。

## 5. 触发部署

配置好环境变量后回到 **Deployments → Redeploy**（或首次点 Deploy）。

构建命令自动用 `package.json` 的 `next build`，输出 `.next/`，Vercel 会托管为 serverless 函数。

## 6. 部署后验证

1. 打开 Vercel 分配的域名（如 `https://stu-management.vercel.app`）
2. 用 `admin / admin` 登录 → 跳转 `/dashboard`
3. 测试：搜索、添加学生、删除、修改、分页
4. 若登录失败或 500：查看 Vercel **Logs**，常见原因：
   - `DATABASE_URL` 拼错或端口不对（用 5432）
   - Supabase Network restrictions 拦截了 Vercel IP
   - 环境变量没对 Production 环境勾选

## 7. 常见问题

- **登录页一提交就 500**：多半是 `DATABASE_URL` 连不通。Vercel Logs 里找 `ECONNREFUSED` / `password authentication failed`，按提示修正连接串或重置数据库密码。
- **数据中文变乱码**：本系统全程 UTF-8，浏览器表单提交正常。仅命令行用非 UTF-8 终端 curl 测试时会出现，生产无关。
- **冷启动慢**：serverless 冷启动连接 DB 慢属正常；`max:3` 已控制连接数。如并发高可在 Vercel 升级或加 `pgBouncer`，但目前体量无需。

## 8. 环境变量速查（复制即用，替换尖括号）

```
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
AUTH_SECRET=<随机32位以上字符串>
```