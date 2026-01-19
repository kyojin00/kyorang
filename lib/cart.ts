export type Packaging = "basic" | "gift";

export type CartItem = {
  productId: string; // DB Product.id
  qty: number;
  packaging: Packaging;
  addedAt: number;
};

const KEY = "kyorang_cart";

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<CartItem[]>(localStorage.getItem(KEY), []);
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));

  // ✅ 같은 탭에서도 즉시 갱신되도록 이벤트 발행
  window.dispatchEvent(new Event("kyorang:cart"));
}

export function addToCart(input: Omit<CartItem, "addedAt">) {
  const cart = readCart();

  // 같은 상품 + 같은 포장 옵션이면 수량 합치기
  const idx = cart.findIndex(
    (x) => x.productId === input.productId && x.packaging === input.packaging
  );

  const next = [...cart];
  if (idx >= 0) {
    next[idx] = { ...next[idx], qty: next[idx].qty + input.qty, addedAt: Date.now() };
  } else {
    next.unshift({ ...input, addedAt: Date.now() });
  }

  writeCart(next);
  return next;
}

export function removeFromCart(productId: string, packaging: Packaging) {
  const cart = readCart();
  const next = cart.filter((x) => !(x.productId === productId && x.packaging === packaging));
  writeCart(next);
  return next;
}

export function updateQty(productId: string, packaging: Packaging, qty: number) {
  const cart = readCart();
  const next = cart.map((x) =>
    x.productId === productId && x.packaging === packaging ? { ...x, qty } : x
  );
  writeCart(next);
  return next;
}

export function clearCart() {
  writeCart([]);
  return [];
}
