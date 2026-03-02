import { api } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const { data } = await api.post<AuthResponse>("/auth/login", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Store tokens
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/register", userData);

    // Store tokens
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const { data } = await api.post<{ access_token: string }>("/auth/refresh", {
      refresh_token: refreshToken,
    });

    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  },

  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
