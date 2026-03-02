"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface Reminder {
  id: number;
  text: string;
  details?: string;
  avatar?: string;
  completed: boolean;
}

const initialReminders: Reminder[] = [
  {
    id: 1,
    text: "Забрать документы",
    details: "сегодня, 11:30 · Пушкина А.",
    avatar: "https://i.pravatar.cc/40?img=10",
    completed: false
  },
  {
    id: 2,
    text: "Подписать акт передачи материалов от заказчика",
    completed: false
  },
  {
    id: 3,
    text: "Поставить печать Илье Владимировичу",
    details: "завтра",
    completed: false
  },
];

export function RemindersWidget() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  return (
    <Card className="h-[236px] w-[434px] relative overflow-hidden">
      <CardHeader>
        <CardTitle>Напоминания</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0 pt-[10px]" style={{ paddingBottom: '59px' }}>
        {reminders.map((reminder, index) => (
          <div key={reminder.id}>
            <div className="flex items-center gap-[10px] h-[40px]">
              <button
                onClick={() => toggleReminder(reminder.id)}
                className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  reminder.completed
                    ? "bg-[#1f1f1f] border-[#737373]"
                    : "border-[#d4d4d4] bg-white hover:border-[#a3a3a3]"
                }`}
              >
                {reminder.completed && (
                  <div className="w-[7px] h-[7px] bg-white rounded-full" />
                )}
              </button>
              <div className="flex-1 flex flex-col gap-[6px] min-w-0">
                <div className={`text-[14px] font-medium leading-[18px] ${
                  reminder.completed ? "line-through text-[#a3a3a3]" : "text-[#1f1f1f]"
                }`}>
                  {reminder.text}
                </div>
                {reminder.details && (
                  <div className="text-[12px] font-normal leading-[14px] text-[#a3a3a3]">
                    {reminder.details}
                  </div>
                )}
              </div>
              {reminder.avatar && (
                <img
                  src={reminder.avatar}
                  alt=""
                  className="w-[20px] h-[20px] rounded-[4px] object-cover shrink-0"
                />
              )}
            </div>
            {index < reminders.length - 1 && (
              <div className="h-[1px] bg-[#e5e5e5]" />
            )}
          </div>
        ))}
      </CardContent>

      {/* Buttons positioned absolutely at bottom */}
      <div className="absolute bottom-[19px] left-[19px] right-[19px] flex gap-[10px]">
        <button className="h-[30px] px-[14px] bg-white border border-[#d4d4d4] rounded-[8px] flex items-center gap-[8px] hover:bg-[#f5f5f5] transition-colors">
          <span className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">Еще 6</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.25 3.5H2.625C2.45924 3.5 2.30027 3.56585 2.18306 3.68306C2.06585 3.80027 2 3.95924 2 4.125V11.375C2 11.5408 2.06585 11.6997 2.18306 11.8169C2.30027 11.9342 2.45924 12 2.625 12H9.875C10.0408 12 10.1997 11.9342 10.3169 11.8169C10.4342 11.6997 10.5 11.5408 10.5 11.375V8.75M8.75 2H12M12 2V5.25M12 2L5.25 8.75" stroke="#1f1f1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="h-[30px] px-[14px] bg-[#1f1f1f] rounded-[8px] flex items-center gap-[8px] ml-auto hover:bg-[#525252] transition-colors">
          <span className="text-[14px] font-medium leading-[18px] text-white">Добавить</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2.625V11.375M11.375 7H2.625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </Card>
  );
}
