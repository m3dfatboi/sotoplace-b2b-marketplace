'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, Star, TrendingUp, MapPin, Phone, Mail, Plus } from 'lucide-react';
import Link from 'next/link';

const mockContractors = [
  {
    id: '1',
    name: 'ООО "ПроизводствоПлюс"',
    description: 'Производство металлоконструкций и мебели на заказ',
    rating: 4.8,
    completedOrders: 156,
    specialties: ['Металлообработка', 'Сварка', 'Покраска'],
    location: 'Москва',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PP&backgroundColor=2563eb',
  },
  {
    id: '2',
    name: 'ИП Сидоров М.А.',
    description: 'Столярные работы, изготовление мебели из массива',
    rating: 4.9,
    completedOrders: 89,
    specialties: ['Столярка', 'Дерево', 'Реставрация'],
    location: 'Санкт-Петербург',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SM&backgroundColor=22c55e',
  },
  {
    id: '3',
    name: 'ООО "ТехноМебель"',
    description: 'Современная офисная мебель, эргономичные решения',
    rating: 4.7,
    completedOrders: 234,
    specialties: ['Офисная мебель', 'Дизайн', 'Монтаж'],
    location: 'Казань',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TM&backgroundColor=f97316',
  },
  {
    id: '4',
    name: 'ИП Кузнецов В.П.',
    description: 'Кузнечные работы, художественная ковка',
    rating: 5.0,
    completedOrders: 67,
    specialties: ['Ковка', 'Металл', 'Декор'],
    location: 'Екатеринбург',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=KV&backgroundColor=6366f1',
  },
];

export default function ContractorsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Биржа контрагентов
          </h1>
          <p className="mt-2 text-muted-foreground">
            Найдите надежных поставщиков и подрядчиков
          </p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg" asChild>
          <Link href="/contractors/new" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Разместить запрос
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Контрагентов</p>
                <p className="text-2xl font-bold text-blue-600">248</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Компаний</p>
                <p className="text-2xl font-bold text-green-600">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Средний рейтинг</p>
                <p className="text-2xl font-bold text-orange-600">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Сделок</p>
                <p className="text-2xl font-bold text-purple-600">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contractors Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {mockContractors.map((contractor) => (
          <Card key={contractor.id} className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                  <AvatarImage src={contractor.logo} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">
                    {contractor.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{contractor.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{contractor.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Rating and Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold">{contractor.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">{contractor.completedOrders} заказов</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{contractor.location}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {contractor.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Отправить запрос
                  </Button>
                  <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600">
                    Профиль
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Не нашли подходящего подрядчика?</h3>
          <p className="text-blue-100 mb-6">
            Разместите запрос, и подрядчики сами свяжутся с вами
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
            <Plus className="mr-2 h-5 w-5" />
            Разместить запрос
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
