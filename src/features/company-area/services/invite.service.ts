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
  primaryEmail?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  businessCategory?: { name: string } | null;
  businessSegment?: { name: string } | null;
}

export interface SupplierDiagnostic {
  id: string;
  status: string;
  percentageCompletion?: number;
  kind?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string | null;
  score?: {
    overallScore: number;
    environmentalScore?: number | null;
    bioeconomyCircularScore?: number | null;
    socialScore?: number | null;
    governanceScore?: number | null;
    provenOverallScore?: number | null;
    provenEnvironmentalScore?: number | null;
    provenBioeconomyCircularScore?: number | null;
    provenSocialScore?: number | null;
    provenGovernanceScore?: number | null;
    maturityLevel?: string | null;
  } | null;
}

export interface RelationshipHistory {
  id: string;
  status: "ACTIVE" | "INACTIVE";
  startedAt: string;
  endedAt?: string | null;
  endedReason?: string | null;
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
  relationship?: RelationshipHistory | null;
}

export interface RankingSupplier {
  id: string;
  tradeName: string;
  legalName: string;
  industrySegment: string;
  primaryEmail?: string | null;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  businessCategory?: { name: string } | null;
  businessSegment?: { name: string } | null;
  completedDiagnostic?: SupplierDiagnostic | null;
  isConnected: boolean;
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

  simulateInvitePurchase(token: string, quantity: number) {
    return request<{ checkoutUrl: string; orderId: string; totalCents: number; productCode: string }>("/checkout/preference", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productCode: "INVITE_PACK", quantity }),
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

  getRanking(token: string) {
    return request<RankingSupplier[]>("/invite/ranking", {
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

  acceptInvite(token: string, inviteToken?: string, buyerOrganizationId?: string) {
    return request<{ buyerOrganization: { id: string; tradeName: string | null; legalName: string }; status: string }>("/invite/accept", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token: inviteToken, ref: buyerOrganizationId }),
    });
  },

  terminateRelationship(token: string, supplierOrganizationId: string, endedReason?: string) {
    return request<unknown>("/invite/relationship/terminate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ supplierOrganizationId, endedReason }),
    });
  },

  reactivateRelationship(token: string, supplierOrganizationId: string) {
    return request<unknown>("/invite/relationship/reactivate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ supplierOrganizationId }),
    });
  },
};
