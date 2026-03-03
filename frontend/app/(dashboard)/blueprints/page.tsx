"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  Download,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Plus
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

// Mock data
const blueprints = [
  {
    id: "1",
    name: "Чертеж верстака v3.dwg",
    orderId: "ORD-2026-001",
    orderName: "Металлический верстак",
    version: 3,
    status: "approved",
    uploadedBy: "Конструктор Петров",
    uploadedAt: "2026-03-02T14:30:00",
    approvedBy: "Клиент ООО «Производство»",
    approvedAt: "2026-03-02T16:45:00",
    comments: 2,
  },
  {
    id: "2",
    name: "Чертеж стола v2.pdf",
    orderId: "ORD-2026-002",
    orderName: "Офисный стол",
    version: 2,
    status: "pending",
    uploadedBy: "Конструктор Иванова",
    uploadedAt: "2026-03-03T09:15:00",
    comments: 5,
  },
  {
    id: "3",
    name: "Чертеж стеллажа v1.dwg",
    orderId: "ORD-2026-003",
    orderName: "Металлический стеллаж",
    version: 1,
    status: "revision",
    uploadedBy: "Конструктор Петров",
    uploadedAt: "2026-03-01T11:20:00",
    comments: 8,
  },
];

const statusConfig = {
  pending: {
    label: "На согласовании",
    variant: "warning" as const,
    icon: Clock,
  },
  approved: {
    label: "Согласован",
    variant: "success" as const,
    icon: CheckCircle2,
  },
  revision: {
    label: "На доработке",
    variant: "error" as const,
    icon: AlertCircle,
  },
};

export default function BlueprintsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Чертежи</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Инжиниринг и согласование проектов
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4" />
          Загрузить чертеж
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Input
          placeholder="Поиск по названию, заказу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Blueprints List */}
      <div className="space-y-4">
        {blueprints.map((blueprint) => {
          const statusInfo = statusConfig[blueprint.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={blueprint.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-neutral-900">
                            {blueprint.name}
                          </h3>
                          <Badge variant={statusInfo.variant} size="sm">
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="default" size="sm">
                            v{blueprint.version}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">
                          Заказ: {blueprint.orderId} • {blueprint.orderName}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-6 text-sm text-neutral-600">
                      <span>
                        Загрузил: {blueprint.uploadedBy}
                      </span>
                      <span>
                        {formatDateTime(blueprint.uploadedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {blueprint.comments} комментариев
                      </span>
                    </div>

                    {/* Approval Info */}
                    {blueprint.status === "approved" && blueprint.approvedBy && (
                      <div className="rounded-lg border border-success-200 bg-success-50 p-3">
                        <div className="flex items-center gap-2 text-sm text-success-700">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>
                            Согласовано: {blueprint.approvedBy} • {formatDateTime(blueprint.approvedAt!)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        Просмотр
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                        Скачать
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                        Комментарии
                      </Button>
                      {blueprint.status === "pending" && (
                        <Button variant="success" size="sm">
                          <CheckCircle2 className="h-4 w-4" />
                          Согласовать
                        </Button>
                      )}
                      {blueprint.status === "revision" && (
                        <Button size="sm">
                          <Upload className="h-4 w-4" />
                          Загрузить новую версию
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-info-200 bg-info-50 p-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-info-100">
            <FileText className="h-5 w-5 text-info-600" />
          </div>
          <div>
            <h3 className="font-medium text-info-900">
              Версионирование и согласование
            </h3>
            <p className="mt-1 text-sm text-info-700">
              Все версии чертежей сохраняются. После согласования клиентом чертеж
              автоматически передаётся в производство. Комментарии привязаны к конкретной версии.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
