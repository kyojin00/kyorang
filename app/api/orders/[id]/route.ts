import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ 중요: await

  if (!id) {
    return NextResponse.json({ message: "orderId가 필요해요." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ message: "주문을 찾을 수 없어요." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
