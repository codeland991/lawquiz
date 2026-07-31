"use client";

import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

function displayName(user: NonNullable<ReturnType<typeof useAuth>["user"]>) {
  const meta = user.user_metadata as Record<string, unknown>;
  return (
    (meta?.name as string) ||
    (meta?.full_name as string) ||
    (meta?.nickname as string) ||
    user.email ||
    "사용자"
  );
}

export default function AuthButton() {
  const { user, loading } = useAuth();

  async function handleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (loading) {
    return <span className="text-xs text-foreground/40 px-2">·</span>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline text-xs text-foreground/60 max-w-[8rem] truncate">
          {displayName(user)}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-full border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="rounded-full bg-[#FEE500] text-black/85 px-3 py-1.5 text-xs font-semibold hover:brightness-95"
    >
      카카오 로그인
    </button>
  );
}
