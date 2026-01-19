import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sort: "asc" } }, inventory: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
