import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const userProtected = ["/mypage", "/wishlist", "/checkout", "/inquiry"];
const isUserProtected = (p: string) => userProtected.some((x) => p === x || p.startsWith(x + "/"));

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req;
    const path = nextUrl.pathname;
    const token = (req as any).nextauth?.token;

    // ✅ 1) 관리자 영역: ADMIN만
    if (path.startsWith("/admin")) {
      if (path.startsWith("/admin/login")) return NextResponse.next();

      if (token?.role !== "ADMIN") {
        const url = new URL("/admin/login", nextUrl);
        url.searchParams.set("error", "NotAdmin");
        url.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    // ✅ 2) 일반 사용자 보호 페이지: 로그인 필요
    if (isUserProtected(path)) {
      if (!token) {
        const url = new URL("/login", nextUrl);
        url.searchParams.set("callbackUrl", path);
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // 여기서 막지 말고 위에서 직접 분기
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
