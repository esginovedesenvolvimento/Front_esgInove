const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export interface DiagnosticStartOption {
  value: number;
  text: string;
}

export interface DiagnosticStartQuestion {
  number: number;
  prompt: string;
  axis: "ENVIRONMENTAL" | "BIOECONOMY_CIRCULAR" | "SOCIAL" | "GOVERNANCE";
  category: string;
  weight?: number;
  options: DiagnosticStartOption[];
}

export interface DiagnosticStartPayload {
  diagnosticId: string;
  industrySegment: string;
  questions: DiagnosticStartQuestion[];
}

export interface DiagnosticCurrentResponse {
  hasDiagnostic: boolean;
  diagnostic: {
    id: string;
    status: string;
    completedAt?: string | null;
    score?: {
      overallScore?: number | null;
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
    _count?: {
      responses: number;
    };
    evidences?: Array<{
      id: string;
      verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
      evidenceCategory?: string | null;
      fileName?: string | null;
      filePath?: string | null;
      fileUrl?: string | null;
      fileSizeBytes?: number | null;
      mimeType?: string | null;
      storageBucket?: string | null;
      uploadStatus?: "PENDING" | "UPLOADING" | "COMPLETED" | "FAILED";
      uploadedAt?: string | null;
    }>;
  } | null;
}

export interface DiagnosticSubmitResponse {
  overallScore?: number;
  environmentalScore?: number;
  bioeconomyCircularScore?: number;
  socialScore?: number;
  governanceScore?: number;
  maturityLevel?: string;
  [key: string]: unknown;
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

export const diagnosticService = {
  startDiagnostic(token: string) {
    return request<DiagnosticStartPayload>("/diagnostic/start", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

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
    return request<DiagnosticCurrentResponse>("/diagnostic/current", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  submitDiagnostic(
    token: string,
    diagnosticId: string,
    responsibilityDeclarationAccepted: boolean,
    responses: Array<{
      questionCode: string;
      questionOrder: number;
      axis: "ENVIRONMENTAL" | "BIOECONOMY_CIRCULAR" | "SOCIAL" | "GOVERNANCE";
      questionText: string;
      questionType: "MULTIPLE_CHOICE" | "TEXT";
      answerText: string;
      options?: string[];
    }>
  ) {
    return request<DiagnosticSubmitResponse>(`/diagnostic/${diagnosticId}/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ responses, responsibilityDeclarationAccepted }),
    });
  },
};
