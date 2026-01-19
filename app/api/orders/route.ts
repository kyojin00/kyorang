import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CartItem = {
  productId: string;
  qty: number;
  packaging: "basic" | "gift";
};

type CreateOrderBody = {
  buyerName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  memo?: string;
  items?: CartItem[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateOrderBody;

    const buyerName = String(body.buyerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address1 = String(body.address1 ?? "").trim();
    const address2 = String(body.address2 ?? "").trim();
    const memo = String(body.memo ?? "").trim();
    const items: CartItem[] = Array.isArray(body.items) ? body.items : [];

    if (!buyerName || !phone || !address1) {
      return NextResponse.json({ message: "필수값 누락" }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ message: "장바구니 비어있음" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const productIds = Array.from(new Set(items.map((i) => i.productId)));

      // 1️⃣ 상품 + 재고 조회
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        include: { inventory: true },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      let subtotal = 0;
      let optionTotal = 0;

      const orderItems = items.map((it) => {
        const p = productMap.get(it.productId);
        if (!p || !p.inventory) {
          throw new Error("INVALID_PRODUCT");
        }

        const qty = Math.max(1, Math.min(99, Number(it.qty ?? 1)));

        // 2️⃣ 재고 부족
        if (p.inventory.stock < qty) {
          throw new Error(`OUT_OF_STOCK:${p.id}`);
        }

        const optionFee = it.packaging === "gift" ? 1000 : 0;
        const lineSubtotal = p.price * qty;
        const lineOption = optionFee * qty;
        const lineTotal = lineSubtotal + lineOption;

        subtotal += lineSubtotal;
        optionTotal += lineOption;

        return {
          productId: p.id,
          productName: p.name,
          unitPrice: p.price,
          qty,
          packaging: it.packaging,
          optionFee,
          lineTotal,
        };
      });

      // 3️⃣ 재고 차감 + 품절 처리
      for (const it of items) {
        const inv = await tx.inventory.update({
          where: { productId: it.productId },
          data: {
            stock: { decrement: it.qty },
          },
          select: { stock: true },
        });

        // ✅ 재고 0 → 자동 품절
        if (inv.stock === 0) {
          await tx.product.update({
            where: { id: it.productId },
            data: { isActive: false },
          });
        }
      }

      // 4️⃣ 배송비
      const FREE_SHIPPING_OVER = 30000;
      const shippingFee = subtotal >= FREE_SHIPPING_OVER ? 0 : 3000;
      const total = subtotal + optionTotal + shippingFee;

      // 5️⃣ 주문 생성
      const order = await tx.order.create({
        data: {
          buyerName,
          phone,
          address1,
          address2: address2 || null,
          memo: memo || null,
          subtotal,
          optionTotal,
          shippingFee,
          total,
          status: "PENDING",
          items: { create: orderItems },
        },
      });

      return order;
    });

    return NextResponse.json({ orderId: result.id });
  } catch (error) {
    console.error("ORDER CREATE ERROR:", error);

    const msg = String(error);

    if (msg.includes("OUT_OF_STOCK")) {
      return NextResponse.json(
        { message: "재고가 부족한 상품이 있어요." },
        { status: 409 }
      );
    }

    if (msg.includes("INVALID_PRODUCT")) {
      return NextResponse.json(
        { message: "유효하지 않은 상품이 포함되어 있어요." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "주문 생성 실패" },
      { status: 500 }
    );
  }
}
