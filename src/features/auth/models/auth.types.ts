export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName?: string;
  companyName?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    companyName: string | null;
  } | null;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    companyName: string | null;
  };
  supabaseUserId: string;
}
