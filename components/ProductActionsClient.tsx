"use client";

import { useMemo, useState } from "react";
import { addToCart, type Packaging } from "@/lib/cart";

function formatWon(v: number) {
  return v.toLocaleString("ko-KR") + "원";
}

export default function ProductActionsClient({
  productId,
  price,
}: {
  productId: string; // DB Product.id
  price: number;
}) {
  const [qty, setQty] = useState(1);
  const [packaging, setPackaging] = useState<Packaging>("basic");

  const extra = packaging === "gift" ? 1000 : 0;
  const total = useMemo(() => (price + extra) * qty, [price, extra, qty]);

  const handleAdd = () => {
    addToCart({ productId, qty, packaging });
    alert("장바구니에 담았어요 🧺");
  };

  const handleBuy = () => {
    addToCart({ productId, qty, packaging });
    window.location.href = "/cart";
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold">옵션</p>

      <div className="mt-3 grid gap-3">
        <div>
          <label className="text-sm text-neutral-600">포장</label>
          <select
            value={packaging}
            onChange={(e) => setPackaging(e.target.value as Packaging)}
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm"
          >
            <option value="basic">기본 포장</option>
            <option value="gift">선물 포장(+1000원)</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-neutral-600">수량</label>
          <div className="mt-2 inline-flex items-center rounded-2xl border border-neutral-200 bg-white">
            <button
              className="px-4 py-2 text-lg"
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="min-w-11 text-center text-sm font-semibold">{qty}</span>
            <button
              className="px-4 py-2 text-lg"
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="text-xs text-neutral-500">
          {packaging === "gift" ? "선물포장 +1,000원 포함" : "기본포장"}
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">합계</p>
          <p className="text-base font-extrabold">{formatWon(total)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm hover:bg-neutral-50 active:scale-[0.99]"
          onClick={handleAdd}
        >
          장바구니 담기
        </button>

        <button
          type="button"
          className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99]"
          onClick={handleBuy}
        >
          바로 구매
        </button>
      </div>

      <div className="mt-3 text-xs text-neutral-500">
        배송: 평일 2시 이전 주문 시 당일 발송 · 30,000원 이상 무료배송
      </div>
    </div>
  );
}
