"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.replace("/");
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
      退出登录
    </Button>
  );
}