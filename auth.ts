import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  // ✅ pages는 user 로그인 기준으로 잡고,
  // admin은 /admin/login에서 직접 처리할 거라 크게 상관 없음
  pages: {
    signIn: "/login",
  },

  providers: [
    // ✅ 1) 일반 유저 로그인
    CredentialsProvider({
      id: "credentials-user",
      name: "User Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
        async authorize(credentials) {
          const email = String(credentials?.email ?? "").trim().toLowerCase();
          const password = String(credentials?.password ?? "").trim();

          console.log("[USER AUTH] try:", email);

          const user = await prisma.user.findUnique({ where: { email } });
          console.log("[USER AUTH] found?", !!user, "role:", (user as any)?.role);

          if (!user) return null;

          const ok = await bcrypt.compare(password, (user as any).password);
          console.log("[USER AUTH] bcrypt ok?", ok);

          if (!ok) return null;

          if ((user as any).role !== "USER") {
            console.log("[USER AUTH] not USER -> blocked");
            return null;
          }

          return { id: user.id, email: user.email, name: user.name, role: (user as any).role };
        },
    }),

    // ✅ 2) 관리자 로그인
    CredentialsProvider({
      id: "credentials-admin",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "").trim();
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, (user as any).password);
        if (!ok) return null;

        // ✅ 관리자 로그인은 ADMIN만 허용
        if ((user as any).role !== "ADMIN") return null;

        return { id: user.id, email: user.email, name: user.name, role: (user as any).role };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
