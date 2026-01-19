"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { formatWon } from "@/lib/products";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function setLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function ProductActions({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const opt of product.options) init[opt.name] = opt.values[0] ?? "";
    return init;
  });

  const [liked, setLiked] = useState(false);

  // like 상태 로드
  useEffect(() => {
    const likes = getLS<string[]>("kyorang_likes", []);
    setLiked(likes.includes(product.id));
  }, [product.id]);

  const addLike = () => {
    const likes = getLS<string[]>("kyorang_likes", []);
    const next = likes.includes(product.id) ? likes : [product.id, ...likes];
    setLS("kyorang_likes", next);
    setLiked(true);
  };
  const removeLike = () => {
    const likes = getLS<string[]>("kyorang_likes", []);
    const next = likes.filter((id) => id !== product.id);
    setLS("kyorang_likes", next);
    setLiked(false);
  };
  const toggleLike = () => (liked ? removeLike() : addLike());

  const total = useMemo(() => product.price * qty, [product.price, qty]);

  const addToCart = () => {
    type CartItem = {
      id: string;
      qty: number;
      options: Record<string, string>;
      addedAt: number;
    };

    const cart = getLS<CartItem[]>("kyorang_cart", []);
    // 동일 상품+옵션이면 수량 합치기
    const idx = cart.findIndex(
      (x) => x.id === product.id && JSON.stringify(x.options) === JSON.stringify(selected)
    );

    const next = [...cart];
    if (idx >= 0) next[idx] = { ...next[idx], qty: next[idx].qty + qty, addedAt: Date.now() };
    else next.unshift({ id: product.id, qty, options: selected, addedAt: Date.now() });

    setLS("kyorang_cart", next);
    alert("장바구니에 담았어요 🧺");
  };

  const buyNow = () => {
    // 실제 결제는 나중에 붙이고, 지금은 장바구니로 보내는 형태로
    addToCart();
    window.location.href = "/cart";
  };

  return (
    <div className="space-y-4">
      {/* Price */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-neutral-500">판매가</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">{formatWon(product.price)}</p>
          </div>
          <button
            type="button"
            onClick={toggleLike}
            className={[
              "rounded-full border px-4 py-2 text-sm shadow-sm transition active:scale-[0.99]",
              liked
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-neutral-200 bg-white hover:bg-neutral-50",
            ].join(" ")}
          >
            {liked ? "❤️ 찜됨" : "🤍 찜하기"}
          </button>
        </div>

        {/* Options */}
        <div className="mt-4 space-y-3">
          {product.options.map((opt) => (
            <div key={opt.name} className="space-y-2">
              <p className="text-sm font-semibold">{opt.name}</p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((v) => {
                  const active = selected[opt.name] === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelected((s) => ({ ...s, [opt.name]: v }))}
                      className={[
                        "rounded-full border px-4 py-2 text-sm transition",
                        active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">수량</p>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center rounded-2xl border border-neutral-200 bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => clamp(q - 1, 1, 99))}
                  className="px-4 py-2 text-lg"
                  aria-label="minus"
                >
                  −
                </button>
                <span className="min-w-11 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => clamp(q + 1, 1, 99))}
                  className="px-4 py-2 text-lg"
                  aria-label="plus"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <p className="text-xs text-neutral-500">합계</p>
                <p className="text-base font-extrabold">{formatWon(total)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping info */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold">배송</p>
        <ul className="mt-2 space-y-1 text-sm text-neutral-600">
          <li>• {product.shipping.eta}</li>
          <li>
            • 배송비 {formatWon(product.shipping.fee)} ( {formatWon(product.shipping.freeOver)} 이상 무료 )
          </li>
        </ul>
      </div>

      {/* Sticky actions (mobile) */}
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={addToCart}
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm hover:bg-neutral-50 active:scale-[0.99]"
        >
          장바구니 담기
        </button>
        <button
          type="button"
          onClick={buyNow}
          className="rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99]"
        >
          바로 구매
        </button>
      </div>

      <p className="text-xs text-neutral-500">
        * 현재는 데모라서 장바구니/찜은 <span className="font-medium">localStorage</span>에 저장돼요.
      </p>
    </div>
  );
}
