import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export type AdminSessionUser = {
  id: string;
  email: string;
  fullName: string | null;
  role?: string;
};

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("inoveesg_token")?.value;

  if (!token) {
    redirect("/?auth=true");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/?auth=true");
  }

  if (!response.ok) {
    redirect("/?auth=true");
  }

  const user = (await response.json()) as AdminSessionUser;

  if (user?.role !== "ADMIN") {
    redirect("/app");
  }

  return {
    token,
    user,
  };
}
