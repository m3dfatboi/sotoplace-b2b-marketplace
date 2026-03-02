import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, LoginRequest, RegisterRequest } from "@/services";
import { usersService } from "@/services";
import { useRouter } from "next/navigation";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
      router.push("/");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
      router.push("/");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => usersService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: usersService.changePassword,
  });
}
