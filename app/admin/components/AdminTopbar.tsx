"use client";

import { signOut, useSession } from "next-auth/react";

export default function AdminTopbar() {
  const { data: session, status } = useSession();

  const name = session?.user?.name ?? "관리자";
  const email = session?.user?.email ?? "";
  const role = (session?.user as any)?.role ?? "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-black text-white flex items-center justify-center text-sm font-semibold">
            K
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900">교랑상점 Admin</div>
            <div className="text-[12px] text-gray-500">관리자 콘솔</div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="text-sm text-gray-500">세션 확인 중...</div>
          ) : (
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <div className="text-sm font-medium text-gray-900">
                {name}
                {role ? <span className="ml-1 text-xs text-gray-500">({role})</span> : null}
              </div>
              {email ? <div className="text-[12px] text-gray-500">{email}</div> : null}
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
