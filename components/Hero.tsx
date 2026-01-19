export default function Hero() {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-gradient-to-b from-rose-50 to-white p-6 shadow-sm md:p-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
            오늘도 귀여움 충전 💗
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight md:text-4xl">
            작고 귀여운 거…
            <br className="hidden md:block" /> 그게 행복이야
          </h1>
          <p className="mt-3 text-sm text-neutral-600 md:text-base">
            교랑상점 추천 소품으로 하루를 더 말랑하게 만들어봐요.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="#new"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              신상 보러가기
            </a>
            <a
              href="#best"
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium hover:bg-neutral-50"
            >
              베스트 보러가기
            </a>
          </div>

          <div className="mt-6 grid gap-2 text-xs text-neutral-600 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-3">🚚 평일 오후 2시 전 주문 당일 발송</div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-3">🎁 포토리뷰 작성 시 적립금 지급</div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-3">💌 이벤트 시 손편지/랜덤 스티커 동봉</div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-3">✅ 교환·반품 안내는 하단에서 확인</div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="space-y-3">
            <div className="rounded-2xl bg-rose-50 p-4">
              <p className="text-sm font-semibold">교랑 PICK 🎀</p>
              <p className="mt-1 text-xs text-neutral-600">힐링 핑크 감성템 모아보기</p>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm font-semibold">잼민이 귀염템 ✨</p>
              <p className="mt-1 text-xs text-neutral-600">반짝반짝 포인트 소품 모음</p>
            </div>
            <div className="rounded-2xl border border-dashed border-neutral-300 p-4">
              <p className="text-sm font-semibold">공지</p>
              <p className="mt-1 text-xs text-neutral-600">
                단순변심/착오구매로 인한 교환·반품은 어려워요 🥺
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
