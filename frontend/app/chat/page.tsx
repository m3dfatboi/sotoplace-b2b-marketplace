'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Paperclip, Search, Plus, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const mockChats = [
  {
    id: '1',
    name: 'Заказ ORD-2024-001',
    type: 'order',
    lastMessage: 'Когда планируется доставка?',
    lastMessageTime: new Date('2024-03-03T14:30:00Z'),
    unreadCount: 2,
    participants: [
      { name: 'ООО "СтройМастер"', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SM&backgroundColor=2563eb' },
      { name: 'ИП Петров А.В.', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PA&backgroundColor=22c55e' },
    ],
  },
  {
    id: '2',
    name: 'Заказ ORD-2024-002',
    type: 'order',
    lastMessage: 'Согласовали цвет, можно производить',
    lastMessageTime: new Date('2024-03-03T12:15:00Z'),
    unreadCount: 0,
    participants: [
      { name: 'ООО "МебельПром"', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MP&backgroundColor=f97316' },
      { name: 'ООО "СтройМастер"', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SM&backgroundColor=2563eb' },
    ],
  },
  {
    id: '3',
    name: 'Техподдержка',
    type: 'support',
    lastMessage: 'Ваш вопрос передан специалисту',
    lastMessageTime: new Date('2024-03-02T16:45:00Z'),
    unreadCount: 1,
    participants: [
      { name: 'Поддержка Sotoplace', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SP&backgroundColor=6366f1' },
    ],
  },
  {
    id: '4',
    name: 'Общий чат компании',
    type: 'general',
    lastMessage: 'Завтра планерка в 10:00',
    lastMessageTime: new Date('2024-03-02T09:30:00Z'),
    unreadCount: 5,
    participants: [
      { name: 'Команда', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TM&backgroundColor=22c55e' },
    ],
  },
];

export default function ChatPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Сообщения
          </h1>
          <p className="mt-2 text-muted-foreground">
            Общайтесь с контрагентами и командой
          </p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
          <Plus className="mr-2 h-5 w-5" />
          Новый чат
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего чатов</p>
                <p className="text-2xl font-bold text-blue-600">{mockChats.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <Badge className="h-6 w-6 bg-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Непрочитанных</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockChats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Активных</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockChats.filter(c => c.unreadCount > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat List */}
        <Card className="border-0 shadow-lg lg:col-span-1">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск чатов..."
                className="pl-9 border-gray-200"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockChats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-blue-100">
                        <AvatarImage src={chat.participants[0].avatar} />
                        <AvatarFallback className="bg-blue-600 text-white font-semibold">
                          {chat.participants[0].name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {chat.unreadCount > 0 && (
                        <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(chat.lastMessageTime, { addSuffix: true, locale: ru })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-blue-200">
                <AvatarImage src={mockChats[0].participants[0].avatar} />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">
                  {mockChats[0].participants[0].name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{mockChats[0].name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {mockChats[0].participants.map(p => p.name).join(', ')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-6 mb-4">
                <MessageSquare className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time чат</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                WebSocket интеграция для мгновенного обмена сообщениями с контрагентами и командой
              </p>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Send className="mr-2 h-4 w-4" />
                  Отправить сообщение
                </Button>
                <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Прикрепить файл
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Info */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">🚀 Скоро: Real-time чаты</h3>
          <p className="text-purple-100 mb-4">
            WebSocket интеграция для мгновенного обмена сообщениями, typing indicators, read receipts и файловые вложения
          </p>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            В разработке
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
