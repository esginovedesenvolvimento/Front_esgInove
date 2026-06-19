export type AdminAxis = "E" | "B" | "S" | "G";

export type BudgetRequestStatus = "PENDING" | "IN_REVIEW" | "PROPOSAL_SENT" | "APPROVED" | "REJECTED";

export type EvidenceReviewStatus = "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";

export type ClientHealthStatus = "healthy" | "watch" | "critical";

export type SupplierPipelineStatus = "INVITED" | "ACTIVE" | "RESPONDED" | "OVERDUE";

export interface AdminMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone?: "emerald" | "amber" | "slate" | "rose";
}

export interface AdminBudgetRequest {
  id: string;
  organizationName: string;
  legalName: string;
  sector: string;
  employeeCount: string;
  annualRevenue: string;
  objective: string;
  timeline: string;
  focusAreas: Array<"E" | "B" | "S" | "G">;
  hasPriorInventory: string;
  phone: string;
  notes?: string | null;
  proposalValue: string;
  status: BudgetRequestStatus;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface AdminClientSummary {
  id: string;
  tradeName: string;
  legalName: string;
  segment: string;
  plan: string;
  diagnosticStatus: "CONTRACTED" | "DRAFT" | "COMPLETED";
  health: ClientHealthStatus;
  lastDiagnosticAt: string;
  score: number;
  evidencePending: number;
  supplierCoverage: string;
  activeUsers: number;
}

export interface AdminSupplierSummary {
  id: string;
  companyName: string;
  contactEmail: string;
  segment: string;
  status: SupplierPipelineStatus;
  progress: number;
  score: number;
  evidencePending: number;
  invitedAt: string;
  lastUpdate: string;
}

export interface AdminEvidenceSummary {
  id: string;
  title: string;
  companyName: string;
  supplierName: string;
  axis: AdminAxis;
  questionCode: string;
  status: EvidenceReviewStatus;
  uploadDate: string;
  reviewer: string;
  fileName: string;
  severity: "low" | "medium" | "high";
}

export interface AdminAxisInsight {
  axis: AdminAxis;
  label: string;
  score: number;
  responseRate: number;
  evidenceCoverage: number;
  pendingItems: number;
  trend: number;
}

export interface AdminTrendPoint {
  label: string;
  value: number;
}

export interface AdminInsightCard {
  title: string;
  description: string;
  tone: "emerald" | "amber" | "rose" | "slate";
}

export interface AdminOverviewModel {
  metrics: AdminMetric[];
  queue: AdminBudgetRequest[];
  clientHighlights: AdminClientSummary[];
  supplierHighlights: AdminSupplierSummary[];
  evidenceHighlights: AdminEvidenceSummary[];
  insights: AdminInsightCard[];
}

export interface AdminBudgetBoardModel {
  metrics: AdminMetric[];
  requests: AdminBudgetRequest[];
  groupedByStatus: Record<BudgetRequestStatus, number>;
  openValue: string;
}

export interface AdminClientBoardModel {
  metrics: AdminMetric[];
  clients: AdminClientSummary[];
  healthDistribution: Record<ClientHealthStatus, number>;
}

export interface AdminSupplierBoardModel {
  metrics: AdminMetric[];
  suppliers: AdminSupplierSummary[];
  pipeline: Record<SupplierPipelineStatus, number>;
}

export interface AdminEvidenceBoardModel {
  metrics: AdminMetric[];
  evidences: AdminEvidenceSummary[];
  reviewDistribution: Record<EvidenceReviewStatus, number>;
}

export interface AdminAnalyticsBoardModel {
  metrics: AdminMetric[];
  axisInsights: AdminAxisInsight[];
  trend: AdminTrendPoint[];
  maturityBands: Array<{ label: string; value: number; tone: "emerald" | "amber" | "rose" | "slate" }>;
  notes: AdminInsightCard[];
}
