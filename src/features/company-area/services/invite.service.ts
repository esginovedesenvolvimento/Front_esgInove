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

export interface InviteStats {
  totalInvitesPurchased: number;
  availableInvites: number;
  consumedInvites: number;
  connectedSuppliersCount: number;
  averageSupplierScore: number;
  answeredCount: number;
  notAnsweredCount: number;
}

export interface SupplierOrganization {
  id: string;
  tradeName: string;
  legalName: string;
  industrySegment: string;
}

export interface SupplierDiagnostic {
  id: string;
  status: string;
  percentageCompletion: number;
  score?: {
    overallScore: number;
    environmentalScore?: number | null;
    bioeconomyCircularScore?: number | null;
    socialScore?: number | null;
    governanceScore?: number | null;
  } | null;
}

export interface SupplierInvite {
  id: string;
  buyerOrganizationId: string;
  supplierOrganizationId?: string | null;
  supplierEmail: string;
  token: string;
  status: "PENDING" | "SENT" | "ACCEPTED" | "EXPIRED" | "CANCELED";
  message?: string | null;
  createdAt: string;
  acceptedAt?: string | null;
  supplierOrganization?: SupplierOrganization | null;
  requestedDiagnostics: SupplierDiagnostic[];
}

export const inviteService = {
  getStats(token: string) {
    return request<InviteStats>("/invite/stats", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  simulateInvitePurchase(token: string, quantity: number, option: "standard" | "evidence") {
    return request<{ checkoutUrl: string; orderId: string; totalCents: number }>("/invite/simulate-purchase", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity, option }),
    });
  },

  confirmPayment(token: string, orderId: string, simulateStatus: "success" | "failure") {
    return request<{ success: boolean; orderId: string }>("/invite/confirm-payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId, simulateStatus }),
    });
  },

  listInvites(token: string) {
    return request<SupplierInvite[]>("/invite", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createInvite(token: string, supplierEmail: string, message?: string) {
    return request<{ invite: SupplierInvite; inviteLink: string }>("/invite", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ supplierEmail, message }),
    });
  },
};
