"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  Eye,
  EyeOff,
  MessageSquare
} from "lucide-react";

// Mock data
const contractors = [
  {
    id: "1",
    name: "ООО «Металлообработка»",
    specializations: ["Металлообработка", "Сварка", "Токарные работы"],
    rating: 4.8,
    completedOrders: 156,
    location: "Москва",
    isVerified: true,
    contactsRevealed: true,
    phone: "+7 (495) 123-45-67",
    email: "info@metalwork.ru",
  },
  {
    id: "2",
    name: "ИП Иванов А.С.",
    specializations: ["Столярные работы", "Мебель на заказ"],
    rating: 4.9,
    completedOrders: 89,
    location: "Санкт-Петербург",
    isVerified: true,
    contactsRevealed: false,
  },
  {
    id: "3",
    name: "ООО «ПромСтрой»",
    specializations: ["Строительство", "Монтаж", "Проектирование"],
    rating: 4.6,
    completedOrders: 234,
    location: "Екатеринбург",
    isVerified: true,
    contactsRevealed: true,
    phone: "+7 (343) 987-65-43",
    email: "contact@promstroy.ru",
  },
  {
    id: "4",
    name: "ООО «ТехноЛаб»",
    specializations: ["Электроника", "Автоматизация", "ПЛК"],
    rating: 4.7,
    completedOrders: 67,
    location: "Новосибирск",
    isVerified: false,
    contactsRevealed: false,
  },
  {
    id: "5",
    name: "ООО «Логистика Плюс»",
    specializations: ["Логистика", "Складирование", "Доставка"],
    rating: 4.5,
    completedOrders: 312,
    location: "Москва",
    isVerified: true,
    contactsRevealed: true,
    phone: "+7 (495) 555-12-34",
    email: "logistics@logplus.ru",
  },
];

export default function ContractorsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleRevealContacts = (contractorId: string) => {
    // In real app, this would make an API call
    console.log("Reveal contacts for:", contractorId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Контрагенты</h1>
          <p className="mt-1 text-sm text-neutral-600">
            База компаний и поиск подрядчиков
          </p>
        </div>
        <Button>
          <Building2 className="h-4 w-4" />
          Добавить компанию
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Поиск по названию, специализации..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contractors.map((contractor) => (
          <Card key={contractor.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">
                      {contractor.name}
                    </h3>
                    {contractor.isVerified && (
                      <Badge variant="success" size="sm">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-neutral-600">
                    <MapPin className="h-3 w-3" />
                    {contractor.location}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {/* Rating & Orders */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning-500 text-warning-500" />
                  <span className="font-medium text-neutral-900">
                    {contractor.rating}
                  </span>
                </div>
                <span className="text-neutral-600">
                  {contractor.completedOrders} заказов
                </span>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-2">
                {contractor.specializations.map((spec, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {spec}
                  </Badge>
                ))}
              </div>

              {/* Contacts */}
              {contractor.contactsRevealed ? (
                <div className="space-y-2 rounded-lg border border-success-200 bg-success-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-success-700">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">Контакты открыты</span>
                  </div>
                  {contractor.phone && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Phone className="h-3 w-3" />
                      {contractor.phone}
                    </div>
                  )}
                  {contractor.email && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Mail className="h-3 w-3" />
                      {contractor.email}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <EyeOff className="h-4 w-4" />
                    <span>Контакты скрыты</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Откроются после согласования сделки
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              {contractor.contactsRevealed ? (
                <>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4" />
                    Написать
                  </Button>
                  <Button className="flex-1">Создать заказ</Button>
                </>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleRevealContacts(contractor.id)}
                >
                  Запросить контакты
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-info-200 bg-info-50 p-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-info-100">
            <EyeOff className="h-5 w-5 text-info-600" />
          </div>
          <div>
            <h3 className="font-medium text-info-900">
              Безопасные сделки
            </h3>
            <p className="mt-1 text-sm text-info-700">
              Контакты подрядчиков открываются только после согласования условий сделки.
              Это защищает обе стороны и обеспечивает прозрачность процесса.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
