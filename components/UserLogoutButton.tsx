"use client";

import { signOut } from "next-auth/react";

export default function UserLogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/", // 로그아웃 후 메인 페이지
        })
      }
      className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-300"
    >
      로그아웃
    </button>
  );
}
