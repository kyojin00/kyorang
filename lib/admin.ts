import { headers } from "next/headers";

export async function requireAdmin() {
  const h = await headers();
  const key = h.get("x-admin-key");
  if (!process.env.ADMIN_KEY) return;
  if (key !== process.env.ADMIN_KEY) {
    throw new Error("UNAUTHORIZED");
  }
}
