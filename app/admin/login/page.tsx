"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { signIn, useSession, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const error = searchParams.get("error");

  const errorMessage = useMemo(() => {
    if (!error) return "";
    if (error === "CredentialsSignin") return "이메일 또는 비밀번호가 올바르지 않습니다.";
    if (error === "NotAdmin") return "관리자 계정이 아닙니다.";
    return "로그인 중 오류가 발생했습니다.";
  }, [error]);

  // 이미 로그인 상태면 role 확인 후 라우팅
  useEffect(() => {
    if (status !== "authenticated") return;

    if ((session?.user as any)?.role === "ADMIN") {
      router.replace("/admin");
    } else {
      router.replace("/"); // ✅ 일반 유저면 메인으로
    }
  }, [status, session, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials-admin", {
      email,
      password,
      redirect: false,
    });


    setLoading(false);

    if (!res) return;

    if (res.error) {
      router.replace(`/admin/login?error=${encodeURIComponent(res.error)}`);
      return;
    }

    // ✅ 로그인 성공 후 세션 다시 읽어서 role로 분기
    const s = await getSession();
    const role = (s?.user as any)?.role;

    if (role === "ADMIN") router.replace("/admin");
    else router.replace("/"); // ✅ 일반 유저면 메인으로
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">관리자 로그인</h1>
            <p className="text-sm text-gray-500 mt-1">관리자 계정으로만 접속 가능합니다.</p>
          </div>

          {errorMessage ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black text-white py-2.5 text-sm font-medium hover:bg-black/90 disabled:opacity-60"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
