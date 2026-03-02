import { api } from "@/lib/api";
import { Company } from "@/types";

export interface CreateCompanyRequest {
  name: string;
  inn: string;
  type: Company["type"];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  status?: Company["status"];
}

export interface CompanyMember {
  id: number;
  user_id: number;
  company_id: number;
  role: string;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
}

export const companiesService = {
  async getMyCompanies(): Promise<Company[]> {
    const { data } = await api.get<Company[]>("/companies/my");
    return data;
  },

  async getCompany(id: number): Promise<Company> {
    const { data } = await api.get<Company>(`/companies/${id}`);
    return data;
  },

  async createCompany(companyData: CreateCompanyRequest): Promise<Company> {
    const { data } = await api.post<Company>("/companies", companyData);
    return data;
  },

  async updateCompany(id: number, companyData: UpdateCompanyRequest): Promise<Company> {
    const { data } = await api.patch<Company>(`/companies/${id}`, companyData);
    return data;
  },

  async getCompanyMembers(id: number): Promise<CompanyMember[]> {
    const { data } = await api.get<CompanyMember[]>(`/companies/${id}/members`);
    return data;
  },

  async addCompanyMember(id: number, memberData: {
    user_id: number;
    role: string;
  }): Promise<CompanyMember> {
    const { data } = await api.post<CompanyMember>(`/companies/${id}/members`, memberData);
    return data;
  },
};
