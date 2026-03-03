"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Mail
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Настройки</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Персональные настройки и предпочтения
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Профиль</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Полное имя
                </label>
                <Input
                  defaultValue="Алексей Смирнов"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Email
                </label>
                <Input
                  type="email"
                  defaultValue="alexey@production.ru"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Телефон
                </label>
                <Input
                  type="tel"
                  defaultValue="+7 (999) 123-45-67"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end">
                <Button>Сохранить изменения</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">
                    Email уведомления
                  </p>
                  <p className="text-sm text-neutral-600">
                    Получать уведомления о новых заказах
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">
                    Согласование чертежей
                  </p>
                  <p className="text-sm text-neutral-600">
                    Уведомлять о новых чертежах на согласовании
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">
                    Комментарии
                  </p>
                  <p className="text-sm text-neutral-600">
                    Уведомлять о новых комментариях
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>Безопасность</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Текущий пароль
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Новый пароль
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">
                  Подтвердите пароль
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end">
                <Button>Изменить пароль</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Разделы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Button variant="secondary" className="w-full justify-start">
                <User className="h-4 w-4" />
                Профиль
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-4 w-4" />
                Уведомления
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Lock className="h-4 w-4" />
                Безопасность
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Palette className="h-4 w-4" />
                Внешний вид
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Globe className="h-4 w-4" />
                Язык и регион
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-neutral-600">Роль:</p>
                <Badge variant="primary" className="mt-1">
                  Администратор
                </Badge>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Компания:</p>
                <p className="mt-1 font-medium text-neutral-900">
                  ООО «Производство»
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Дата регистрации:</p>
                <p className="mt-1 text-sm text-neutral-900">15.01.2025</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
