"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Reminder {
  id: number;
  text: string;
  completed: boolean;
}

const initialReminders: Reminder[] = [
  { id: 1, text: "Заказать материалы для проекта #2060", completed: false },
  { id: 2, text: "Подписать счет передачи материалов на заказчика", completed: false },
  { id: 3, text: "Постановить печать Инны Владимировну", completed: false },
];

export function RemindersWidget() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  return (
    <Card className="h-[236px]">
      <CardHeader>
        <CardTitle>Напоминания</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0 mb-4">
          {reminders.map((reminder, index) => (
            <div key={reminder.id}>
              <div className="flex items-center gap-3 py-2.5">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    reminder.completed
                      ? "bg-[#67bb34] border-[#67bb34]"
                      : "border-[#d4d4d4] bg-white"
                  }`}
                >
                  {reminder.completed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <span className={`text-sm flex-1 ${reminder.completed ? "line-through text-[#a3a3a3]" : "text-[#1f1f1f]"}`}>
                  {reminder.text}
                </span>
              </div>
              {index < reminders.length - 1 && <div className="h-px bg-[#e5e5e5]" />}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            Добавить
          </Button>
          <Button variant="outline" size="sm" className="ml-auto">
            Посмотреть все
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
