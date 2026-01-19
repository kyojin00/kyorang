import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

type Body = {
  productId?: string;
  delta?: number; // + 재입고, - 차감
};

export async function POST(req: Request) {
  try {
    // ✅ NextAuth 세션 기반 관리자 체크
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | null)?.role;

    if (!session?.user || role !== "ADMIN") {
      return NextResponse.json({ message: "관리자 권한이 필요해요." }, { status: 401 });
    }

    const body = (await req.json()) as Body;

    const productId = String(body.productId ?? "").trim();
    const delta = Number(body.delta ?? 0);

    if (!productId || !Number.isFinite(delta) || delta === 0) {
      return NextResponse.json(
        { message: "productId, delta(+/-)가 필요해요." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1) 상품 존재 확인
      const product = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, isActive: true },
      });
      if (!product) throw new Error("NO_PRODUCT");

      // 2) 재고 upsert + 증감
      const inv = await tx.inventory.upsert({
        where: { productId },
        create: { productId, stock: 0 },
        update: {},
        select: { stock: true },
      });

      // 3) 새 재고 계산 (음수 방지)
      const nextStock = Math.max(0, inv.stock + delta);

      // 4) 재고 반영
      const updatedInv = await tx.inventory.update({
        where: { productId },
        data: { stock: nextStock },
        select: { stock: true },
      });

      // ✅ 5) 자동 품절/활성 (stock 0 => false, else true)
      const nextActive = updatedInv.stock > 0;

      await tx.product.update({
        where: { id: productId },
        data: { isActive: nextActive },
      });

      return {
        productId,
        stock: updatedInv.stock,
        isActive: nextActive,
      };
    });

    return NextResponse.json(result);
  } catch (e) {
    const msg = String(e);
    if (msg.includes("NO_PRODUCT")) {
      return NextResponse.json({ message: "상품이 없어요." }, { status: 404 });
    }
    console.error("ADMIN INVENTORY ERROR:", e);
    return NextResponse.json({ message: "재고 변경 실패" }, { status: 500 });
  }
}
