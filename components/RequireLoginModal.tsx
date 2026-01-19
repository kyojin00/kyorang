"use client";

import Link from "next/link";

export default function RequireLoginModal({
  open,
  onClose,
  callbackUrl,
}: {
  open: boolean;
  onClose: () => void;
  callbackUrl: string;
}) {
  if (!open) return null;

  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">로그인이 필요해요 🔐</h2>
        <p className="mt-2 text-sm text-gray-600">
          주문 기능은 로그인 후 이용할 수 있어요.
          <br />
          로그인하고 계속 진행해 주세요!
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
          >
            닫기
          </button>

          <Link
            href="/signup"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
          >
            회원가입
          </Link>

          <Link
            href={loginHref}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-black/90"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
