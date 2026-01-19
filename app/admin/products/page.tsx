"use client";

import { useState } from "react";

export default function AdminProductsPage() {
  const [key, setKey] = useState("");
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1000);
  const [stock, setStock] = useState(10);
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/seed/admin/800/800");

  const create = async () => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ slug, name, price, stock, imageUrl, isActive: true, description: "" }),
    });

    if (!res.ok) {
      alert("실패! ADMIN_KEY 또는 slug 중복 확인");
      return;
    }
    alert("등록 완료 ✅");
    setSlug("");
    setName("");
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-extrabold">관리자: 상품 등록</h1>

      <label className="mt-6 block text-sm font-semibold">ADMIN KEY</label>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={key} onChange={(e) => setKey(e.target.value)} />

      <label className="mt-4 block text-sm font-semibold">slug (URL용)</label>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} />

      <label className="mt-4 block text-sm font-semibold">상품명</label>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />

      <label className="mt-4 block text-sm font-semibold">가격</label>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />

      <label className="mt-4 block text-sm font-semibold">재고</label>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />

      <label className="mt-4 block text-sm font-semibold">대표 이미지 URL</label>
      <input className="mt-2 w-full rounded-xl border px-3 py-2" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

      <button onClick={create} className="mt-6 w-full rounded-xl bg-black px-4 py-3 font-semibold text-white">
        등록하기
      </button>

      <p className="mt-4 text-sm text-neutral-600">
        등록 후 메인 페이지에서 바로 확인 가능해요.
      </p>
    </main>
  );
}
