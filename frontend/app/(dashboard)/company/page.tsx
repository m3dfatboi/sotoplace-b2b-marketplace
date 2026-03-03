"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Settings,
  CreditCard,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle2
} from "lucide-react";

// Mock data
const company = {
  name: "ООО «Производство»",
  legalName: "Общество с ограниченной ответственностью «Производство»",
  inn: "7701234567",
  kpp: "770101001",
  ogrn: "1234567890123",
  address: "г. Москва, ул. Примерная, д. 1",
  phone: "+7 (495) 123-45-67",
  email: "info@production.ru",
  website: "https://production.ru",
  isVerified: true,
};

const members = [
  {
    id: "1",
    name: "Алексей Смирнов",
    email: "alexey@production.ru",
    role: "admin",
    status: "active",
    joinedAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Мария Кузнецова",
    email: "maria@production.ru",
    role: "manager",
    status: "active",
    joinedAt: "2025-02-01",
  },
  {
    id: "3",
    name: "Иван Петров",
    email: "ivan@production.ru",
    role: "engineer",
    status: "active",
    joinedAt: "2025-02-15",
  },
];

const roleLabels = {
  admin: "Администратор",
  manager: "Менеджер",
  engineer: "Конструктор",
  viewer: "Наблюдатель",
};

export default function CompanyPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Компания</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Профиль организации и управление командой
          </p>
        </div>
        <Button>
          <Edit className="h-4 w-4" />
          Редактировать
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Company Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Информация о компании</CardTitle>
                {company.isVerified && (
                  <Badge variant="success">
                    <CheckCircle2 className="h-3 w-3" />
                    Верифицирована
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Название
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">{company.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    ИНН
                  </label>
                  <p className="mt-1 font-mono text-sm text-neutral-900">
                    {company.inn}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    КПП
                  </label>
                  <p className="mt-1 font-mono text-sm text-neutral-900">
                    {company.kpp}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    ОГРН
                  </label>
                  <p className="mt-1 font-mono text-sm text-neutral-900">
                    {company.ogrn}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Юридическое название
                </label>
                <p className="mt-1 text-sm text-neutral-900">
                  {company.legalName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Адрес
                </label>
                <p className="mt-1 text-sm text-neutral-900">{company.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Телефон
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">{company.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-neutral-900">{company.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Веб-сайт
                </label>
                <p className="mt-1 text-sm text-primary-600">{company.website}</p>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Сотрудники</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                  Пригласить
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {member.name}
                        </p>
                        <p className="text-sm text-neutral-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="default">
                        {roleLabels[member.role as keyof typeof roleLabels]}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4" />
                Реквизиты
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4" />
                Документы
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4" />
                Публичный каталог
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4" />
                Настройки
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Сотрудников:</span>
                <span className="font-medium text-neutral-900">
                  {members.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Активных заказов:</span>
                <span className="font-medium text-neutral-900">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Товаров в каталоге:</span>
                <span className="font-medium text-neutral-900">156</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
