import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") ?? "").trim();
  const token = String(url.searchParams.get("token") ?? "");

  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ message: "관리자 권한이 필요해요." }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
          ],
        }
      : undefined,
    include: { inventory: true, images: { orderBy: { sort: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      isActive: p.isActive,
      stock: p.inventory?.stock ?? 0,
      image: p.images[0]?.url ?? null,
    })),
  });
}
