import { prisma } from "../lib/prisma";

async function main() {
  await prisma.product.createMany({
    data: [
      {
        slug: "pink-heart-sticker-pack",
        name: "핑크 하트 스티커팩 (10매)",
        price: 1900,
        description: "교랑상점 감성 스티커팩이에요. 다꾸/꾸미기에 딱!",
        isActive: true,
      },
      {
        slug: "soft-bunny-keyring",
        name: "말랑 키링 - 토끼",
        price: 5900,
        description: "가방에 달면 귀여움 +100. 실물 깡패!",
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  const products = await prisma.product.findMany();

  for (const p of products) {
    await prisma.productImage.createMany({
      data: [
        { productId: p.id, url: "https://picsum.photos/seed/" + p.slug + "1/800/800", sort: 0 },
        { productId: p.id, url: "https://picsum.photos/seed/" + p.slug + "2/800/800", sort: 1 },
      ],
      skipDuplicates: true,
    });

    await prisma.inventory.upsert({
      where: { productId: p.id },
      update: {},
      create: { productId: p.id, stock: 50 },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
