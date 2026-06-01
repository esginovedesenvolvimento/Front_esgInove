export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  companyName: string;
  cnpj: string;
  industrySegment?: string;
  size?: string;
  numberOfSuppliers?: string;
  annualRevenue?: string;
  ref?: string;
}

export interface AuthOrganization {
  id: string;
  legalName: string;
  tradeName: string | null;
  cnpj: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser | null;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
  organization: AuthOrganization;
}
