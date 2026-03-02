import { api } from "@/lib/api";
import { User } from "@/types";

export interface UpdateProfileRequest {
  full_name?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const usersService = {
  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>("/users/me");
    return data;
  },

  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    const { data } = await api.patch<User>("/users/me", profileData);
    return data;
  },

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    await api.post("/users/me/change-password", passwordData);
  },
};
