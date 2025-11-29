import type { AuthUser } from "@/store/auth.store";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignupPayload = AuthCredentials & {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role?: string;
};

export type OtpPayload = {
  code: string;
};

export type AuthResponse = {
  token?: string;
  access_token?: string;
  accessToken?: string;
  user?: AuthUser;
  data?: {
    token?: string;
    access_token?: string;
    accessToken?: string;
    user?: AuthUser;
  };
  message?: string;
};

export type RegisterResponse = {
  message: string;
};
