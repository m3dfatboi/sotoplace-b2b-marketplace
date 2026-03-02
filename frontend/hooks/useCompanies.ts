import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesService, CreateCompanyRequest, UpdateCompanyRequest } from "@/services";

export function useMyCompanies() {
  return useQuery({
    queryKey: ["myCompanies"],
    queryFn: () => companiesService.getMyCompanies(),
  });
}

export function useCompany(id: number) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => companiesService.getCompany(id),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyData: CreateCompanyRequest) =>
      companiesService.createCompany(companyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myCompanies"] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyRequest }) =>
      companiesService.updateCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myCompanies"] });
      queryClient.invalidateQueries({ queryKey: ["company", variables.id] });
    },
  });
}

export function useCompanyMembers(companyId: number) {
  return useQuery({
    queryKey: ["companyMembers", companyId],
    queryFn: () => companiesService.getCompanyMembers(companyId),
    enabled: !!companyId,
  });
}

export function useAddCompanyMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, memberData }: {
      companyId: number;
      memberData: { user_id: number; role: string };
    }) => companiesService.addCompanyMember(companyId, memberData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companyMembers", variables.companyId] });
    },
  });
}
