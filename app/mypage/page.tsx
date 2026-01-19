import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const name = session.user?.name ?? "회원";
  const email = session.user?.email ?? "";
  const role = (session.user as any)?.role ?? "";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-900">마이페이지</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {name}님 정보입니다.
        </p>

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex gap-3">
            <span className="w-24 text-neutral-500">이메일</span>
            <span className="font-medium text-neutral-900">{email}</span>
          </div>
          <div className="flex gap-3">
            <span className="w-24 text-neutral-500">권한</span>
            <span className="font-medium text-neutral-900">{role}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700">
          다음 단계로 주문내역/배송조회/찜목록/회원정보 수정 섹션을 붙이면 완성!
        </div>
      </div>
    </div>
  );
}
