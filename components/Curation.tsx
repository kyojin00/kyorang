export default function Curation() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <a href="/curation/pink" className="rounded-3xl border border-neutral-200 bg-rose-50 p-6 hover:shadow-sm">
        <p className="text-sm font-semibold">힐링 핑크 감성 세트</p>
        <p className="mt-1 text-sm text-neutral-600">마음이 말랑해지는 색감 + 귀여운 포인트</p>
        <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium">모아보기 →</p>
      </a>

      <a href="/curation/kids" className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 hover:shadow-sm">
        <p className="text-sm font-semibold">잼민이 귀염템 모음</p>
        <p className="mt-1 text-sm text-neutral-600">친구들이 “어디서 샀어?” 물어보는 아이템</p>
        <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium">모아보기 →</p>
      </a>
    </div>
  );
}
