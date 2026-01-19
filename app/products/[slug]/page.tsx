import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductActionsClient from "@/components/ProductActionsClient";

function formatWon(v: number) {
  return v.toLocaleString("ko-KR") + "원";
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { sort: "asc" } }, inventory: true },
  });

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-lg font-semibold">상품을 찾을 수 없어요 🥺</p>
        <Link className="mt-4 inline-block rounded-full border px-4 py-2 hover:bg-neutral-50" href="/">
          메인으로 돌아가기
        </Link>
      </main>
    );
  }

  const cover = product.images[0]?.url ?? "https://picsum.photos/seed/empty/800/800";

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <Link href="/" className="hover:text-neutral-800">홈</Link>
        <span>/</span>
        <span className="text-neutral-900">{product.name}</span>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
            <Image
              src={cover}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 520px"
              priority
            />
          </div>

          <div className="rounded-2xl bg-neutral-50 p-3 text-sm text-neutral-600">
            💡 교랑상점은 포장도 진심이에요. 포토리뷰 남기면 선물도 챙겨드려요 🎀
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-neutral-600">{product.description}</p>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-neutral-500">판매가</p>
                <p className="text-xl font-extrabold">{formatWon(product.price)}</p>
              </div>

              <div className="text-right text-xs text-neutral-500">
                재고: <span className="font-semibold text-neutral-900">{product.inventory?.stock ?? 0}</span>개
              </div>
            </div>
          </div>

          {/* ✅ DB Product.id로 장바구니 저장 */}
          <ProductActionsClient productId={product.id} price={product.price} />
        </div>
      </section>
    </main>
  );
}
