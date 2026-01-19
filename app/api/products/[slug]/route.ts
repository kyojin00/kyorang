import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { sort: "asc" } }, inventory: true },
  });

  if (!product) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  return NextResponse.json(product);
}
