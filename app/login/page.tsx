"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginNoticeModal from "@/components/LoginNoticeModal";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 안내 팝업 상태는 컴포넌트 최상단에서 선언
  const [showNotice, setShowNotice] = useState(false);

    const error = searchParams.get("error");
    const callbackUrlParam = searchParams.get("callbackUrl");
    const callbackUrl = callbackUrlParam || "/";

  // ✅ callbackUrl이 있으면(보호페이지에서 튕겨온 경우) 팝업 자동 표시
        useEffect(() => {
        // 보호 페이지에서 온 경우 + 로그인 에러 아님 → 팝업
        if (callbackUrlParam && !error) {
            setShowNotice(true);
        } else {
            setShowNotice(false);
        }
        }, [callbackUrlParam, error]);

  const errorMessage = useMemo(() => {
    if (!error) return "";
    if (error === "CredentialsSignin") return "이메일 또는 비밀번호가 올바르지 않습니다.";
    return "로그인 중 오류가 발생했습니다.";
  }, [error]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials-user", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!res) return;

    if (res.error) {
      router.replace(`/login?error=${encodeURIComponent(res.error)}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    // ✅ 로그인 성공 후 세션 확인 (혹시 role이 ADMIN이면 관리자로 보냄)
    const s = await getSession();
    const role = (s?.user as any)?.role;

    if (role === "ADMIN") {
      router.replace("/admin");
      return;
    }

    // ✅ 원래 가려던 곳으로 복귀
    router.replace(res.url ?? callbackUrl);
  }

  return (
    <>
      <LoginNoticeModal open={showNotice} onClose={() => setShowNotice(false)} />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900">로그인</h1>
          <p className="text-sm text-gray-500 mt-1">일반 회원 로그인</p>

          {errorMessage ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium hover:bg-black/90 disabled:opacity-60"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>

            <div className="text-xs text-gray-500">
              관리자 로그인은 <a className="underline" href="/admin/login">여기</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
