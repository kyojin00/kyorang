"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserTopbar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-full border-b bg-white/80 backdrop-blur px-4 py-2 text-sm text-gray-500">
        세션 확인 중...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full border-b bg-white/80 backdrop-blur px-4 py-2 flex justify-end gap-3 text-sm">
        <Link href="/login" className="font-medium underline">
          로그인
        </Link>
        <Link href="/admin/login" className="text-gray-500 underline">
          관리자
        </Link>
      </div>
    );
  }

  const name = session.user?.name ?? "회원";

  return (
    <div className="w-full border-b bg-white/80 backdrop-blur px-4 py-2 flex justify-between items-center">
      <div className="text-sm text-gray-700">
        {name}님
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200"
      >
        로그아웃
      </button>
    </div>
  );
}
