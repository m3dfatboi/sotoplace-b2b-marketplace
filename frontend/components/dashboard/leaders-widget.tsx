"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Leader {
  rank: number;
  name: string;
  avatar: string;
  count: number;
}

const mockLeaders: Leader[] = [
  { rank: 1, name: "Владимировна A", avatar: "https://i.pravatar.cc/40?img=1", count: 24 },
  { rank: 2, name: "Богомолов Л", avatar: "https://i.pravatar.cc/40?img=2", count: 20 },
  { rank: 3, name: "Огнев А", avatar: "https://i.pravatar.cc/40?img=3", count: 18 },
  { rank: 4, name: "Терентьев В", avatar: "https://i.pravatar.cc/40?img=4", count: 17 },
  { rank: 5, name: "Лопухина К", avatar: "https://i.pravatar.cc/40?img=5", count: 11 },
];

export function LeadersWidget() {
  return (
    <Card className="h-[236px]">
      <CardHeader>
        <div className="flex items-end gap-[6px]">
          <CardTitle>Лидеры</CardTitle>
          <CardDescription>за неделю</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-[163px]">
        {mockLeaders.map((leader, index) => (
          <div key={leader.rank}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <div className="w-[10px] text-center text-[14px] font-medium leading-[18px] text-[#a3a3a3]">
                  {leader.rank}
                </div>
                <img
                  src={leader.avatar}
                  alt={leader.name}
                  className="w-[20px] h-[20px] rounded-[6px] object-cover"
                />
                <div className="text-[14px] font-medium leading-[18px] text-[#1f1f1f]">
                  {leader.name}
                </div>
              </div>
              <div className="text-[14px] font-semibold leading-[18px] text-[#d18043]">
                {leader.count}
              </div>
            </div>
            {index < mockLeaders.length - 1 && (
              <div className="h-[1px] bg-[#e5e5e5] my-[7.875px]" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
