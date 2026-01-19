import Image from "next/image";
import { reviews } from "@/lib/mock";

function Stars({ n }: { n: number }) {
  return <span aria-label={`${n} stars`}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

export default function ReviewGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={r.image} alt="review" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>{r.nickname}</span>
              <span className="text-amber-600"><Stars n={r.rating} /></span>
            </div>
            <p className="mt-2 text-sm text-neutral-700">{r.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
