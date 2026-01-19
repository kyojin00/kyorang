"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  isActive: boolean;
  stock: number;
  image: string | null;
};

function formatWon(v: number) {
  return v.toLocaleString("ko-KR") + "원";
}

export default function AdminInventoryPage() {
  const [token, setToken] = useState("");
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("ADMIN_TOKEN") ?? "";
    setToken(saved);
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("ADMIN_TOKEN", token);
  }, [token]);

  const canLoad = token.trim().length > 0;

  const load = async () => {
    if (!canLoad) {
      setMsg("관리자 토큰을 입력해줘.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/products?token=${encodeURIComponent(token)}&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message ?? "불러오기 실패");
        setProducts([]);
        return;
      }
      setProducts(data.products ?? []);
    } catch {
      setMsg("네트워크 오류");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 토큰이 있으면 최초 1회 로드
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const changeStock = async (productId: string, delta: number) => {
    if (!canLoad) return;
    setBusyId(productId);
    setMsg("");
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminToken: token,
          productId,
          delta,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.message ?? "재고 변경 실패");
        return;
      }

      // UI 반영
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, stock: data.stock, isActive: data.isActive }
            : p
        )
      );
    } catch {
      setMsg("네트워크 오류");
    } finally {
      setBusyId(null);
    }
  };

  const headerText = useMemo(() => {
    if (!canLoad) return "관리자 토큰을 입력하면 상품/재고를 관리할 수 있어요.";
    return "검색 후 버튼으로 재고를 조정해보세요. 재고 0이면 자동 품절, 0 초과면 자동 판매 재개!";
  }, [canLoad]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold">관리자 · 재고 관리</h1>
        <p className="mt-2 text-sm text-neutral-600">{headerText}</p>
      </div>

      <div className="grid gap-3 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:grid-cols-3">
        <div className="md:col-span-1">
          <p className="text-sm font-semibold">관리자 토큰</p>
          <input
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
            placeholder="ADMIN_TOKEN 입력"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="mt-2 text-xs text-neutral-500">
            * 개발용 임시 보호입니다. 나중에 로그인/role로 바꾸면 더 안전해요.
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-semibold">상품 검색</p>
          <div className="mt-2 flex gap-2">
            <input
              className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
              placeholder="이름 또는 slug로 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") load();
              }}
            />
            <button
              type="button"
              onClick={load}
              disabled={!canLoad || loading}
              className="shrink-0 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "로딩..." : "검색"}
            </button>
          </div>

          {msg ? <p className="mt-3 text-sm text-rose-600">{msg}</p> : null}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-600 shadow-sm">
            {canLoad ? "검색 결과가 없어요." : "토큰을 입력하면 목록을 불러올 수 있어요."}
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="grid gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-[88px_1fr_auto]"
            >
              <div className="relative h-22 w-22 overflow-hidden rounded-2xl bg-neutral-100">
                {p.image ? (
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="88px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    no image
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-extrabold">{p.name}</p>
                  <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
                    {p.slug}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      p.isActive ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                    }`}
                  >
                    {p.isActive ? "판매중" : "품절/비활성"}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                  <span>가격: <b className="text-neutral-900">{formatWon(p.price)}</b></span>
                  <span>재고: <b className="text-neutral-900">{p.stock}</b></span>
                </div>

                <p className="mt-2 text-xs text-neutral-500">
                  * 재고가 0이 되면 자동 품절 처리(isActive=false), 0 초과면 자동 판매 재개(isActive=true)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <StockBtn disabled={busyId === p.id} onClick={() => changeStock(p.id, +1)}>+1</StockBtn>
                <StockBtn disabled={busyId === p.id} onClick={() => changeStock(p.id, +10)}>+10</StockBtn>
                <StockBtn disabled={busyId === p.id} onClick={() => changeStock(p.id, +50)}>+50</StockBtn>

                <div className="mx-1 h-6 w-px bg-neutral-200" />

                <StockBtn disabled={busyId === p.id} onClick={() => changeStock(p.id, -1)} variant="danger">-1</StockBtn>
                <StockBtn disabled={busyId === p.id} onClick={() => changeStock(p.id, -10)} variant="danger">-10</StockBtn>

                {busyId === p.id ? (
                  <span className="ml-2 text-xs text-neutral-500">적용 중...</span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

function StockBtn({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "danger";
}) {
  const base =
    "rounded-full px-3 py-2 text-xs font-semibold shadow-sm active:scale-[0.99] disabled:opacity-50";
  const cls =
    variant === "danger"
      ? `${base} border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100`
      : `${base} border border-neutral-200 bg-white hover:bg-neutral-50`;

  return (
    <button type="button" className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
