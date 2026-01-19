import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

function formatWon(v: number) {
  return v.toLocaleString("ko-KR") + "원";
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const sp = await searchParams; // ✅ 중요: await
  const orderId = String(sp.orderId ?? "").trim();

  if (!orderId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-extrabold">주문번호가 없어요 🥺</p>
          <p className="mt-2 text-sm text-neutral-600">orderId가 필요해요.</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          >
            메인으로
          </Link>
        </div>
      </main>
    );
  }

  // ✅ 여기서는 굳이 API fetch 하지 말고 서버에서 바로 Prisma로 조회하는게 제일 안정적
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-extrabold">주문을 찾을 수 없어요 🥺</p>
          <p className="mt-2 text-sm text-neutral-600">orderId: {orderId}</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          >
            메인으로
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-rose-600">주문 완료 🎉</p>
        <h1 className="mt-2 text-2xl font-extrabold">주문이 저장되었어요!</h1>
        <p className="mt-2 text-sm text-neutral-600">
          아직 결제는 연결하지 않았고, 주문 데이터만 저장된 상태예요.
        </p>

        <div className="mt-6 rounded-2xl bg-neutral-50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">주문번호</span>
            <span className="font-semibold">{order.id}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-semibold">주문자 정보</p>
            <div className="mt-3 space-y-1 text-sm text-neutral-700">
              <p>이름: {order.buyerName}</p>
              <p>연락처: {order.phone}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-semibold">배송지</p>
            <div className="mt-3 space-y-1 text-sm text-neutral-700">
              <p>{order.address1}</p>
              {order.address2 ? <p>{order.address2}</p> : null}
              {order.memo ? (
                <p className="text-neutral-500">메모: {order.memo}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold">주문 상품</p>
          <div className="mt-3 space-y-2">
            {order.items.map((it: { id: Key | null | undefined; productName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; packaging: string; optionFee: number; qty: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; lineTotal: number; unitPrice: number; }) => (
              <div
                key={it.id}
                className="rounded-2xl border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{it.productName}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {it.packaging === "gift" ? "선물 포장" : "기본 포장"}
                      {it.optionFee ? ` (+${formatWon(it.optionFee)}/개)` : ""}
                      {" · "}수량 x{it.qty}
                    </p>
                  </div>
                  <p className="text-sm font-extrabold">
                    {formatWon(it.lineTotal)}
                  </p>
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  단가 {formatWon(it.unitPrice)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-sm font-semibold">결제 요약</p>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="상품금액" value={formatWon(order.subtotal)} />
            <Row label="옵션(포장)" value={formatWon(order.optionTotal)} />
            <Row label="배송비" value={formatWon(order.shippingFee)} />
            <div className="my-2 h-px bg-neutral-200" />
            <Row
              label={<span className="font-extrabold">총 결제금액</span>}
              value={
                <span className="font-extrabold">{formatWon(order.total)}</span>
              }
            />
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            쇼핑 계속하기
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-neutral-50"
          >
            장바구니 보기
          </Link>
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-neutral-500">{label}</div>
      <div className="text-neutral-900">{value}</div>
    </div>
  );
}
