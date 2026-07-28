"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import { useState } from "react";

const MESSAGES: Record<string, string> = {
  added: "添加学生信息成功",
  updated: "学生信息修改成功",
  deleted: "删除学生信息成功",
};

export function FlashMessage() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const msgKey = params.get("msg");
  const [visible, setVisible] = useState(!!msgKey);

  useEffect(() => {
    if (msgKey) {
      setVisible(true);
      const t = setTimeout(() => {
        // 清除 query 后保持其余参数
        const sp = new URLSearchParams(params.toString());
        sp.delete("msg");
        router.replace(`${pathname}${sp.size ? `?${sp.toString()}` : ""}`);
        setVisible(false);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [msgKey, params, router, pathname]);

  if (!visible || !msgKey || !MESSAGES[msgKey]) return null;

  return (
    <div className="flex items-center gap-2 rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
      <CheckCircle2 className="h-4 w-4" />
      <span>{MESSAGES[msgKey]}</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-auto text-green-700 hover:text-green-900"
        aria-label="关闭"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}