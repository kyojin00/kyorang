"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  readCart,
  removeFromCart,
  updateQty,
  clearCart,
  type CartItem,
  type Packaging,
} from "@/lib/cart";

import RequireLoginModal from "@/components/RequireLoginModal";

type ProductLite = {
  id: string;
  name: string;
  price: number;
  image: string | null;
};

function formatWon(v: number) {
  return v.toLocaleString("ko-KR") + "원";
}

const FREE_SHIPPING_OVER = 30000;
const SHIPPING_FEE = 3000;

export default function CartPage() {
  const router = useRouter();
  const { status } = useSession();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const checkoutPath = "/checkout";

  const onClickCheckout = () => {
    if (status !== "authenticated") {
      setLoginModalOpen(true);
      return;
    }
    router.push(checkoutPath);
  };

  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, ProductLite>>({});
  const [loading, setLoading] = useState(true);

  // 1) cart load
  useEffect(() => {
    setItems(readCart());
    setLoading(false);
  }, []);

  // 2) cart가 바뀌면 DB에서 상품정보 조회
  useEffect(() => {
    const productIds = Array.from(new Set(items.map((it) => it.productId)));
    if (productIds.length === 0) {
      setProducts({});
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/products/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: productIds }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message ?? "상품 조회 실패");

        const map: Record<string, ProductLite> = {};
        for (const p of data.products as ProductLite[]) {
          map[p.id] = p;
        }
        if (!cancelled) setProducts(map);
      } catch {
        // 상품 조회 실패해도 카트 UI는 유지
        if (!cancelled) setProducts({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [items]);

  // helpers
  const changeQty = (productId: string, packaging: Packaging, nextQty: number) => {
    const qty = Math.max(1, Math.min(99, nextQty));
    const next = updateQty(productId, packaging, qty);
    setItems(next);
  };

  const removeItem = (productId: string, packaging: Packaging) => {
    const next = removeFromCart(productId, packaging);
    setItems(next);
  };

  const emptyCart = () => {
    clearCart();
    setItems([]);
  };

  // 계산
  const summary = useMemo(() => {
    let subtotal = 0; // 상품금액 합
    let optionTotal = 0; // 선물포장 옵션 합(1000 * qty)
    let count = 0;

    for (const it of items) {
      const p = products[it.productId];
      const price = p?.price ?? 0;
      const qty = it.qty ?? 1;

      subtotal += price * qty;
      optionTotal += (it.packaging === "gift" ? 1000 : 0) * qty;
      count += qty;
    }

    const shippingFee = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : SHIPPING_FEE;
    const total = subtotal + optionTotal + shippingFee;

    const remainFree = Math.max(0, FREE_SHIPPING_OVER - subtotal);
    const progress =
      subtotal <= 0 ? 0 : Math.min(100, Math.round((subtotal / FREE_SHIPPING_OVER) * 100));

    return { subtotal, optionTotal, shippingFee, total, remainFree, progress, count };
  }, [items, products]);

  if (!loading && items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
          <p className="text-xl font-extrabold">장바구니가 비어 있어요 🧺</p>
          <p className="mt-2 text-sm text-neutral-600">교랑상점 소품으로 오늘도 귀여움 충전!</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white"
          >
            쇼핑하러 가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <RequireLoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        callbackUrl={checkoutPath}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">장바구니 🧺</h1>
            <p className="mt-1 text-sm text-neutral-600">
              총 <span className="font-semibold text-neutral-900">{summary.count}</span>개 담겼어요
            </p>
          </div>

          <button
            type="button"
            onClick={emptyCart}
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
          >
            전체 비우기
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* left: items */}
          <section className="space-y-3">
            {items.map((it) => {
              const p = products[it.productId];
              const name = p?.name ?? "상품 정보를 불러오는 중...";
              const price = p?.price ?? 0;
              const image = p?.image ?? "https://picsum.photos/seed/empty/600/600";
              const optionFee = it.packaging === "gift" ? 1000 : 0;
              const lineTotal = (price + optionFee) * it.qty;

              return (
                <div
                  key={`${it.productId}-${it.packaging}`}
                  className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-neutral-100">
                      <Image src={image} alt={name} fill className="object-cover" sizes="96px" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">{name}</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            옵션: {it.packaging === "gift" ? "선물 포장(+1000원)" : "기본 포장"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(it.productId, it.packaging)}
                          className="rounded-full px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                        >
                          삭제
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        {/* qty control */}
                        <div className="inline-flex items-center rounded-2xl border border-neutral-200 bg-white">
                          <button
                            type="button"
                            className="px-4 py-2 text-lg"
                            onClick={() => changeQty(it.productId, it.packaging, it.qty - 1)}
                          >
                            −
                          </button>
                          <span className="min-w-11 text-center text-sm font-semibold">{it.qty}</span>
                          <button
                            type="button"
                            className="px-4 py-2 text-lg"
                            onClick={() => changeQty(it.productId, it.packaging, it.qty + 1)}
                          >
                            +
                          </button>
                        </div>

                        {/* price */}
                        <div className="text-right">
                          <p className="text-xs text-neutral-500">소계</p>
                          <p className="text-sm font-extrabold">{formatWon(lineTotal)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* right: summary */}
          <aside className="space-y-3">
            {/* free shipping */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold">무료배송까지</p>

              {summary.remainFree === 0 ? (
                <p className="mt-2 text-sm text-rose-600 font-semibold">🎉 무료배송 조건 달성!</p>
              ) : (
                <p className="mt-2 text-sm text-neutral-700">
                  <span className="font-extrabold">{formatWon(summary.remainFree)}</span> 더 담으면
                  무료배송이에요 ✨
                </p>
              )}

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-rose-400 transition-all"
                  style={{ width: `${summary.progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-neutral-500">
                기준: 상품금액 {formatWon(FREE_SHIPPING_OVER)} 이상 무료배송
              </p>
            </div>

            {/* totals */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold">결제 요약</p>

              <div className="mt-4 space-y-2 text-sm text-neutral-700">
                <Row label="상품금액" value={formatWon(summary.subtotal)} />
                <Row label="옵션(선물포장)" value={formatWon(summary.optionTotal)} />
                <Row label="배송비" value={formatWon(summary.shippingFee)} />
                <div className="my-3 h-px bg-neutral-200" />
                <Row
                  label={<span className="font-extrabold text-neutral-900">총 결제금액</span>}
                  value={<span className="font-extrabold">{formatWon(summary.total)}</span>}
                />
              </div>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={onClickCheckout}
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 active:scale-[0.99]"
                >
                  주문서 작성하기
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-neutral-50"
                >
                  쇼핑 더 하기
                </Link>
              </div>

              <p className="mt-3 text-xs text-neutral-500">* 금액은 상품 DB 기준으로 계산돼요.</p>
            </div>
          </aside>
        </div>

        <div className="h-10" />
      </main>
    </>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-neutral-500">{label}</div>
      <div className="text-neutral-900">{value}</div>
    </div>
  );
}
