import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "学生信息管理系统",
  description: "基于 Next.js + Supabase + Drizzle 的学生信息管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}