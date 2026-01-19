"use client";

import CartBadge from "@/components/CartBadge";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react"; // ✅ 추가




type PanelKey = "new" | "best" | "category" | "event" | "support" | null;

const CATEGORIES = [
  { key: "sticker", label: "스티커" },
  { key: "memo", label: "메모지" },
  { key: "seal", label: "씰/마스킹" },
  { key: "keyring", label: "키링" },
  { key: "postcard", label: "엽서" },
  { key: "diary", label: "다이어리" },
  { key: "pouch", label: "파우치" },
  { key: "random", label: "랜덤박스" },
];

export default function Header() {
  const { data: session, status } = useSession(); // ✅ 여기서 호출
  const [open, setOpen] = useState<PanelKey>(null);

  // 패널 DOM (패널 내부 클릭은 닫히지 않게)
  const panelRef = useRef<HTMLDivElement | null>(null);

  // “패널이 열려있는 동안”에만 바깥 클릭 감지 (패널 영역 밖 클릭 시 닫힘)
  useEffect(() => {
    if (!open) return;

    function handleOutside(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(null);
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const nav = useMemo(
    () => [
      { key: "new" as const, label: "신상" },
      { key: "best" as const, label: "베스트" },
      { key: "category" as const, label: "카테고리" },
      { key: "event" as const, label: "이벤트" },
      { key: "support" as const, label: "고객센터" },
    ],
    []
  );

  const isOpen = (k: PanelKey) => open === k;
  const toggle = (k: PanelKey) => setOpen((prev) => (prev === k ? null : k));

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      {/* Top bar */}
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <a href="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-rose-100 text-lg shadow-sm">
            🎀
          </span>
          <div className="leading-tight">
            <p className="text-base font-extrabold tracking-tight">교랑상점</p>
            <p className="text-[11px] text-neutral-500 group-hover:text-neutral-700">
              작고 귀여운 소품, 오늘도 말랑하게
            </p>
          </div>
        </a>

        {/* Search */}
        <div className="hidden flex-1 md:block">
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-sm">
            <span className="text-neutral-400">🔎</span>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              placeholder="스티커, 키링, 메모지 검색…"
            />
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] text-neutral-500">
              Enter
            </span>
          </div>
        </div>

        {/* Quick actions */}
        {/* Quick actions */}
        <nav className="ml-auto flex items-center gap-1 text-sm">
          {(() => {
            // ✅ 세션 기반 분기
            const role = (session?.user as any)?.role;

            if (status === "loading") {
              return (
                <span className="rounded-full px-3 py-2 text-neutral-500">
                  세션 확인 중...
                </span>
              );
            }

            // ✅ 비로그인
            if (!session) {
              return (
                <>
                  <a className="rounded-full px-3 py-2 hover:bg-neutral-100" href="/login">
                    로그인
                  </a>
                  <a
                    className="rounded-full bg-neutral-900 px-3 py-2 text-white hover:bg-neutral-800"
                    href="/admin/login"
                  >
                    관리자
                  </a>
                  <a className="rounded-full px-3 py-2 hover:bg-neutral-100" href="/cart">
                    장바구니
                    <CartBadge />
                  </a>
                </>
              );
            }

            // ✅ 로그인 상태: role별 버튼
            return (
              <>
                {role === "ADMIN" ? (
                  <a
                    className="rounded-full px-3 py-2 hover:bg-neutral-100"
                    href="/admin"
                  >
                    관리자 대시보드로
                  </a>
                ) : (
                  <a
                    className="rounded-full px-3 py-2 hover:bg-neutral-100"
                    href="/mypage"
                  >
                    마이페이지
                  </a>
                )}

                <a className="rounded-full px-3 py-2 hover:bg-neutral-100" href="/wishlist">
                  찜
                </a>

                <a className="rounded-full px-3 py-2 hover:bg-neutral-100" href="/cart">
                  장바구니
                  <CartBadge />
                </a>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-full px-3 py-2 hover:bg-neutral-100"
                >
                  로그아웃
                </button>
              </>
            );
          })()}
        </nav>

      </div>

      {/* Nav + Panel wrapper */}
      <div className="mx-auto max-w-6xl px-4 pb-3">
        {/* Nav pills */}
        <div className="flex flex-wrap items-center gap-2">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              className={[
                "rounded-full border px-4 py-2 text-sm shadow-sm transition active:scale-[0.98]",
                isOpen(item.key)
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white hover:bg-neutral-50",
              ].join(" ")}
            >
              {item.label}
              <span className="ml-2 inline-block opacity-80">{isOpen(item.key) ? "▲" : "▼"}</span>
            </button>
          ))}

          <a
            href="#best"
            className="ml-auto rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-200"
          >
            오늘의 추천 💗
          </a>
        </div>

        {/* Smooth panel open/close */}
        {/* - max-height + opacity + translateY 로 “자연스러운 열림” */}
        {/* - motion-reduce 대응 */}
        <div
          className={[
            "relative",
            "overflow-hidden",
            "transition-[max-height,opacity,transform] duration-300 ease-out",
            "motion-reduce:transition-none",
            open ? "mt-3 max-h-130 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1",
          ].join(" ")}
        >
          {/* 패널을 감싸는 실제 박스 (여기 ref) */}
          <div
            ref={panelRef}
            className={[
              "rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm",
              "origin-top",
              "transition-transform duration-300 ease-out",
              "motion-reduce:transition-none",
              open ? "scale-100" : "scale-[0.995]",
            ].join(" ")}
          >
            {open === "new" && (
              <Panel title="신상" desc="따끈따끈 새로 들어온 아이템을 모아봤어요.">
                <PanelGrid>
                  <PanelCard title="NEW ARRIVAL" desc="이번 주 업데이트" href="#new" icon="🆕" />
                  <PanelCard title="재입고 알림" desc="품절템 다시 오면 알려줘요" href="#" icon="🔔" />
                  <PanelCard title="한정/시즌" desc="지금만 살 수 있는 귀염템" href="#" icon="⏳" />
                </PanelGrid>
              </Panel>
            )}

            {open === "best" && (
              <Panel title="베스트" desc="많이 사랑받은 아이템만 쏙쏙!">
                <PanelGrid>
                  <PanelCard title="이번 주 BEST" desc="인기 급상승" href="#best" icon="✨" />
                  <PanelCard title="리뷰 많은 순" desc="후기 많은 제품" href="#" icon="💬" />
                  <PanelCard title="선물 추천" desc="주기 딱 좋은 소품" href="#" icon="🎁" />
                </PanelGrid>
              </Panel>
            )}

            {open === "category" && (
              <Panel title="카테고리" desc="원하는 소품을 빠르게 찾아요.">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <a
                      key={c.key}
                      href={`/category/${c.key}`}
                      className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>

                <div className="mt-3 rounded-2xl bg-neutral-50 p-3 text-sm text-neutral-600">
                  💡 Tip: <span className="font-medium text-neutral-900">다꾸/꾸미기</span> 용도라면
                  “씰/마스킹”부터 보는 게 좋아요!
                </div>
              </Panel>
            )}

            {open === "event" && (
              <Panel title="이벤트" desc="지금 참여하면 더 귀엽게 득템!">
                <PanelGrid>
                  <PanelCard title="포토리뷰 이벤트" desc="적립금 + 랜덤 스티커" href="/event/review" icon="📸" />
                  <PanelCard title="무료배송/쿠폰" desc="기간 한정 혜택" href="#" icon="🎫" />
                  <PanelCard title="랜덤박스" desc="뽑기 느낌으로 즐겨요" href="#" icon="🎲" />
                </PanelGrid>
              </Panel>
            )}

            {open === "support" && (
              <Panel title="고객센터" desc="궁금한 점은 여기서 해결!">
                <PanelGrid>
                  <PanelCard title="공지사항" desc="배송/이벤트 안내" href="/notice" icon="📢" />
                  <PanelCard title="자주 묻는 질문" desc="교환/반품/배송" href="/faq" icon="❓" />
                  <PanelCard title="1:1 문의" desc="빠르게 도와드릴게요" href="/inquiry" icon="💌" />
                </PanelGrid>

                <div className="mt-3 text-xs text-neutral-500">
                  운영시간: 평일 10:00~17:00 (점심 12:00~13:00) · ESC로 닫기 가능
                </div>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Panel({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-base font-semibold">{title}</p>
          <p className="mt-1 text-sm text-neutral-500">{desc}</p>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-900">
          교랑 추천 🎀
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function PanelGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-3">{children}</div>;
}

function PanelCard({
  title,
  desc,
  href,
  icon,
}: {
  title: string;
  desc: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-neutral-100 text-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm text-neutral-600">{desc}</p>
        </div>
      </div>
    </a>
  );
}
