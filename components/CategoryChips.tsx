import { categories } from "@/lib/mock";

export default function CategoryChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <a
          key={c.key}
          href={`/category/${c.key}`}
          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
        >
          {c.label}
        </a>
      ))}
    </div>
  );
}
