"use client";

import Link from "next/link";

export default function LoginNoticeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">
          로그인이 필요해요 🔐
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          해당 기능은 로그인 후 이용할 수 있어요.
          <br />
          로그인하거나 회원가입 후 계속 이용해 주세요.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Link
            href="/signup"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
          >
            회원가입
          </Link>

          {/* ✅ 로그인 버튼 = 팝업 닫기 */}
          <button
            onClick={onClose}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-black/90"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
