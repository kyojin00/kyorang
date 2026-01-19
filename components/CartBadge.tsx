"use client";

import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";

function countItems() {
  const cart = readCart();
  return cart.reduce((sum, it) => sum + (it.qty ?? 0), 0);
}

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(countItems());

    const onCartChange = () => setCount(countItems());
    window.addEventListener("kyorang:cart", onCartChange);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "kyorang_cart") setCount(countItems());
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("kyorang:cart", onCartChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (count <= 0) return null;

  return (
    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
