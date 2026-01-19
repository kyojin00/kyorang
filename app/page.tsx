import { prisma } from "@/lib/prisma";
import UserTopbar from "@/components/UserTopbar"; // ✅ 추가
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import CategoryChips from "@/components/CategoryChips";
import Curation from "@/components/Curation";
import ReviewGrid from "@/components/ReviewGrid";
import Footer from "@/components/Footer";
import type { Product } from "@/lib/mock";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sort: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const newRows = products.slice(0, 5);
  const bestRows = products.slice(0, 6);

  const bestForUI: Product[] = bestRows.map((row: any) => ({
    id: row.slug,
    name: row.name,
    price: row.price,
    image: row.images[0]?.url ?? "https://picsum.photos/seed/empty/600/600",
    badges: ["BEST"],
    likes: 0,
    reviews: 0,
  }));

  const newForUI: Product[] = newRows.map((row: any) => ({
    id: row.slug,
    name: row.name,
    price: row.price,
    image: row.images[0]?.url ?? "https://picsum.photos/seed/empty/600/600",
    badges: ["NEW"],
    likes: 0,
    reviews: 0,
  }));

  return (
    <div>
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Hero />

        <section id="best" className="mt-10">
          <SectionTitle title="이번 주 BEST ✨" subtitle="많이 사랑받은 아이템만 모았어요" />
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {bestForUI.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <SectionTitle title="카테고리 한눈에 보기" subtitle="원하는 소품을 빠르게 찾아요" />
          <div className="mt-4">
            <CategoryChips />
          </div>
        </section>

        <section className="mt-10">
          <SectionTitle title="교랑 PICK 🎀" subtitle="테마별로 모아봤어요" />
          <div className="mt-4">
            <Curation />
          </div>
        </section>

        <section id="new" className="mt-10">
          <SectionTitle title="NEW ARRIVAL 🆕" subtitle="따끈따끈 신상 업데이트" />
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {newForUI.map((p) => (
              <div key={p.id} className="min-w-55 max-w-55">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <SectionTitle title="포토리뷰 💬" subtitle="실사용 후기 보고 안심 구매!" />
          <div className="mt-4">
            <ReviewGrid />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
