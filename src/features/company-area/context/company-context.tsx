"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { authService } from "@/features/auth/services/auth.service";

interface OrganizationRole {
  role: "COMPANY" | "SUPPLIER";
  source: string;
}

interface OrganizationEntitlement {
  id: string;
  featureFlag: {
    code: string;
    name: string;
  };
  status: string;
}

interface Subscription {
  id: string;
  status: string;
  renewalAt: string | null;
  plan: {
    priceCents: number;
    product: {
      name: string;
      code: string;
    }
  }
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  product: {
    name: string;
    code: string;
  };
  metadata?: any;
}

export interface Payment {
  id: string;
  method: string;
  status: string;
  amountCents: number;
  paidAt: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderType: "SUBSCRIPTION" | "ONE_TIME" | "INVITE_PACK";
  status: "DRAFT" | "PENDING_PAYMENT" | "PARTIALLY_PAID" | "PAID" | "FAILED" | "CANCELED";
  totalCents: number;
  paidAt: string | null;
  createdAt: string;
  items: OrderItem[];
  payments: Payment[];
}

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  organizationUsers: Array<{
    membershipRole: string;
    organization: {
      id: string;
      legalName: string;
      tradeName: string;
      cnpj?: string;
      phone?: string | null;
      primaryEmail?: string;
      industrySegment?: string;
      roles: OrganizationRole[];
      subscriptions: Subscription[];
      entitlements: OrganizationEntitlement[];
      subjectDiagnostics: any[];
      orders?: Order[];
      inviteWallet?: { balance: number } | null;
    };
  }>;
}

interface CompanyContextType {
  user: UserProfile | null;
  company: UserProfile["organizationUsers"][0]["organization"] | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  // Access Control Helpers
  hasActivePlan: boolean;
  isSupplierOnly: boolean;
  isUnpaid: boolean;
  hasActiveDiagnostic: boolean;
  hasCompletedDiagnostic: boolean;
  hasOnlyPreDiagnostic: boolean;
  hasInviteAccess: boolean;
  activeEntitlements: string[];
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    const token = getCookie("inoveesg_token") as string;

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await authService.getMe(token);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const company = user?.organizationUsers?.[0]?.organization || null;
  
  // Logic helpers
  const activeSubscriptions = company?.subscriptions?.filter(s => s.status === "ACTIVE") || [];
  const hasActivePlan = activeSubscriptions.length > 0;
  
  const roles = company?.roles?.map(r => r.role) || [];
  const isSupplierOnly = roles.includes("SUPPLIER") && !roles.includes("COMPANY");
  
  const activeEntitlements = company?.entitlements?.map(e => e.featureFlag.code) || [];
  
  const hasActiveDiagnostic = (company?.subjectDiagnostics?.length || 0) > 0;
  
  const hasCompletedDiagnostic = company?.subjectDiagnostics?.some(d => d.status === "COMPLETED") || false;

  const hasInviteAccess = (company?.inviteWallet && company.inviteWallet.balance > 0) || 
    (company?.orders?.some(o => o.orderType === "INVITE_PACK" && o.status === "PAID")) || 
    false;
  
  const hasOnlyPreDiagnostic = (hasActiveDiagnostic && 
    !hasActivePlan && 
    company?.subjectDiagnostics?.every(d => d.kind === "PRE_DIAGNOSTIC" || d.kind === "SUPPLIER_DIAGNOSTIC")) ?? false;

  const isUnpaid = !hasActivePlan && activeEntitlements.length === 0 && !hasActiveDiagnostic && !hasInviteAccess;

  return (
    <CompanyContext.Provider value={{ 
      user, 
      company, 
      isLoading, 
      refreshProfile: fetchProfile,
      hasActivePlan,
      isSupplierOnly,
      isUnpaid,
      hasActiveDiagnostic,
      hasCompletedDiagnostic,
      hasOnlyPreDiagnostic,
      hasInviteAccess,
      activeEntitlements
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
