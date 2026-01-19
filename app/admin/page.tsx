import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session) redirect("/admin/login");
  if (role !== "ADMIN") redirect("/"); // ✅ 2중 방어

  const name = session.user?.name ?? "관리자";
  const email = session.user?.email ?? "";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">관리자 대시보드</h1>
        <p className="mt-2 text-sm text-gray-600">
          {name} {email ? `(${email})` : ""} 님, 환영합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="상품 관리" desc="상품 등록/수정/삭제" href="/admin/products" />
        <Card title="주문 관리" desc="주문/배송 상태 관리" href="/admin/orders" />
        <Card title="회원 관리" desc="회원 목록/권한 확인" href="/admin/users" />
      </div>
    </div>
  );
}

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white border border-gray-200 p-5 hover:shadow-sm transition"
    >
      <div className="text-base font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{desc}</div>
      <div className="mt-4 text-sm font-medium text-gray-900">바로가기 →</div>
    </Link>
  );
}
