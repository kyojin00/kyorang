export default function Footer() {
  return (
    <footer className="mt-14 border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-600">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-base font-semibold text-neutral-900">교랑상점</p>
            <p className="mt-2 leading-6">
              고객센터: 010-0000-0000 (평일 10:00~17:00)<br />
              이메일: hello@kyorang.store<br />
              주소: (예시) 광주광역시 …
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <a className="rounded-full bg-neutral-100 px-3 py-2 hover:bg-neutral-200" href="/terms">이용약관</a>
            <a className="rounded-full bg-neutral-100 px-3 py-2 hover:bg-neutral-200" href="/privacy">개인정보처리방침</a>
            <a className="rounded-full bg-neutral-100 px-3 py-2 hover:bg-neutral-200" href="/returns">교환·반품 안내</a>
          </div>
        </div>

        <p className="mt-8 text-xs text-neutral-400">© {new Date().getFullYear()} 교랑상점. All rights reserved.</p>
      </div>
    </footer>
  );
}
