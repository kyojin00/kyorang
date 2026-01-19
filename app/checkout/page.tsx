"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readCart, clearCart, type CartItem } from "@/lib/cart";

type CreateOrderBody = {
  buyerName: string;
  phone: string;
  address1: string;
  address2: string;
  memo: string;
  items: Array<{
    productId: string;
    qty: number;
    packaging: "basic" | "gift";
  }>;
};

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [buyerName, setBuyerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const canSubmit =
    items.length > 0 && buyerName.trim() && phone.trim() && address1.trim();

  const payload: CreateOrderBody = useMemo(() => {
    return {
      buyerName,
      phone,
      address1,
      address2,
      memo,
      items: items.map((it) => ({
        productId: it.productId,
        qty: it.qty,
        packaging: it.packaging,
      })),
    };
  }, [buyerName, phone, address1, address2, memo, items]);

  const submit = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // ✅ JSON이 아닐 수도 있어서 안전 파싱
      let data: any = null;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) {
        alert(data?.message ?? "주문 생성 실패");
        return;
      }

      // 주문 생성 성공 → 장바구니 비우고 완료 페이지 이동
      clearCart();
      window.location.href = `/order/success?orderId=${encodeURIComponent(
        data.orderId
      )}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">주문서 작성 ✍️</h1>
          <p className="mt-1 text-sm text-neutral-600">
            결제 붙이기 전 단계(주문 저장)까지 구현
          </p>
        </div>
        <Link
          href="/cart"
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          장바구니로 →
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold">장바구니가 비어 있어요</p>
          <Link
            className="mt-4 inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
            href="/"
          >
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold">주문자 정보</p>

            <div className="mt-4 grid gap-3">
              <input
                className="rounded-2xl border px-4 py-3 text-sm"
                placeholder="이름"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />
              <input
                className="rounded-2xl border px-4 py-3 text-sm"
                placeholder="연락처"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                className="rounded-2xl border px-4 py-3 text-sm"
                placeholder="주소(기본)"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
              <input
                className="rounded-2xl border px-4 py-3 text-sm"
                placeholder="주소(상세, 선택)"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
              <input
                className="rounded-2xl border px-4 py-3 text-sm"
                placeholder="배송 메모(선택)"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold">장바구니 항목</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              {items.map((it) => (
                <li
                  key={`${it.productId}-${it.packaging}`}
                  className="flex items-center justify-between"
                >
                  <span className="text-neutral-600">
                    {it.productId.slice(0, 6)}… · {it.packaging} · x{it.qty}
                  </span>
                  <span className="text-xs text-neutral-400">
                    (금액은 서버에서 재계산)
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            disabled={!canSubmit || loading}
            onClick={submit}
            className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "주문 생성 중..." : "주문 저장하기"}
          </button>

          <p className="text-xs text-neutral-500">
            * 결제는 아직 연결하지 않았고, 주문만 DB에 저장돼요.
          </p>
        </div>
      )}
    </main>
  );
}
