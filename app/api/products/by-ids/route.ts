import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = (await req.json()) as { ids?: string[] };
  const ids = Array.isArray(body.ids) ? body.ids : [];

  if (ids.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    include: { images: { orderBy: { sort: "asc" } } },
  });

  return NextResponse.json({
    products: products.map((p: { id: any; name: any; price: any; images: { url: any; }[]; }) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.images[0]?.url ?? null,
    })),
  });
}
