import { getCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export interface BudgetInput {
  productCode?: string;
  items?: Array<{
    id: string;
    name?: string;
    type?: string;
  }>;
  sector?: string;
  employeeCount?: string;
  annualRevenue?: string;
  objective?: string;
  timeline?: string;
  focusAreas?: string[];
  hasPriorInventory?: string;
  phone?: string;
  notes?: string;
  months?: number;
}

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

export const budgetService = {
  createRequest(payload: BudgetInput, token: string) {
    return request<any>("/budget", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  listRequests(token: string) {
    return request<any[]>("/budget", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  acceptRequest(id: string, token: string) {
    return request<any>(`/budget/${id}/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  declineRequest(id: string, token: string) {
    return request<any>(`/budget/${id}/decline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
