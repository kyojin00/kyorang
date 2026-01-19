"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="text-sm text-gray-500">세션 확인 중...</div>
    );
  }

  // ✅ 비로그인
  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          로그인
        </Link>
        <Link
          href="/admin/login"
          className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
        >
          관리자
        </Link>
      </div>
    );
  }

  // ✅ 로그인
  const name = session.user?.name ?? "회원";
  const role = (session.user as any)?.role;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end leading-tight">
        <div className="text-sm font-medium text-gray-900">
          {name}
          {role ? <span className="ml-1 text-xs text-gray-500">({role})</span> : null}
        </div>
        {session.user?.email ? (
          <div className="text-[12px] text-gray-500">{session.user.email}</div>
        ) : null}
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200"
      >
        로그아웃
      </button>
    </div>
  );
}
