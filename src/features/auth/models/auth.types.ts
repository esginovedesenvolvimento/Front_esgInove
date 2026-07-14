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
  businessCategoryCode?: string;
  businessSegmentCode?: string;
  specificActivity?: string;
  size?: string;
  numberOfSuppliers?: string;
  annualRevenue?: string;
  ref?: string;
  cpf: string;
  cargoFuncao: string;
  grauParticipacao: string;
  tradeName: string;
  enderecoCompleto: string;
  municipioEstado: string;
  site?: string;
  redesSociais?: string;
  naturezaJuridica: string;
  porte: string;
  tempoOperacao: string;
  alcanceMercado: string;
  esgJaPossui: string[];
  esgInteresse: string[];
}

export interface AuthOrganization {
  id: string;
  legalName: string;
  tradeName: string | null;
  cnpj: string;
  specificActivity: string | null;
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
