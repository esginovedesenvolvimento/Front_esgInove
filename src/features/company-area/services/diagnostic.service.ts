import { getCookie } from "cookies-next";

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

export const diagnosticService = {
  simulatePreDiagnosticPurchase(token: string) {
    return request<{ checkoutUrl: string; diagnosticId: string }>("/diagnostic/simulate-pre-diag", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  confirmPayment(token: string, diagnosticId: string, simulateStatus: "success" | "failure") {
    return request<{ success: boolean; diagnosticId: string }>("/diagnostic/confirm-payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ diagnosticId, simulateStatus }),
    });
  },

  getCurrentDiagnostic(token: string) {
    return request<{ hasDiagnostic: boolean; diagnostic: any }>("/diagnostic/current", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  submitDiagnostic(
    token: string,
    diagnosticId: string,
    responses: Array<{
      questionCode: string;
      questionOrder: number;
      axis: "ENVIRONMENTAL" | "SOCIAL" | "GOVERNANCE";
      questionText: string;
      questionType: "MULTIPLE_CHOICE" | "TEXT";
      answerText: string;
      options?: string[];
    }>
  ) {
    return request<any>(`/diagnostic/${diagnosticId}/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ responses }),
    });
  },
};
