import { cookies } from "next/headers";

export async function getMe() {
  const cookieHeader = cookies().toString();

  const res = await fetch(process.env.LARAVEL_INTERNAL_BASE + "/api/me", {
    method: "GET",
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}