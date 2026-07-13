const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      document.cookie = "inoveesg_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location.href = "/?auth=true";
      return new Promise(() => {});
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}

export const checkoutService = {
  createPreference(
    token: string,
    productCode: "PRE_DIAGNOSTIC" | "PRE_DIAGNOSTIC_PLUS" | "INVITE_PACK" | "LIVRO_ESG",
    quantity = 1
  ) {
    return request<{ checkoutUrl: string; orderId?: string; diagnosticId?: string }>("/checkout/preference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productCode, quantity }),
    });
  },
};
