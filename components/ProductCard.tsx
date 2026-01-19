import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/mock";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/products/${p.id}`}
      className="group block rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, 240px"
          priority={false}
        />
      </div>

      {/* badges */}
      {p.badges?.length ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {p.badges.slice(0, 2).map((b) => (
            <span
              key={b}
              className="rounded-full bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-900"
            >
              {b}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-3 h-5.5" />
      )}

      <p className="mt-2 text-sm font-semibold">{p.name}</p>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-extrabold">{p.price.toLocaleString("ko-KR")}원</p>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {typeof p.likes === "number" ? <span>❤️ {p.likes}</span> : null}
          {typeof p.reviews === "number" ? <span>💬 {p.reviews}</span> : null}
        </div>
      </div>
    </Link>
  );
}
