"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, CalendarDays, Heart, UserRoundCog } from "lucide-react";


const TABS = [
  { name: "홈", path: "/", icon: Store },
  { name: "예약 내역", path: "/bookings", icon: CalendarDays },
  { name: "즐겨찾기", path: "/favorites", icon: Heart },
  { name: "설정", path: "/settings", icon: UserRoundCog },
];

/////////////////////////////////////////////////////////////////////


export default function TabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-blue-50  flex flex-col items-center pb-24">
      <div className="w-full max-w-xl min-h-screen bg-white flex flex-col relative">
        {children}
      </div>

      <nav className="fixed bottom-4 left-0 right-0 max-w-xl mx-auto px-4 z-50">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg flex items-center justify-around py-2.5 px-3">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = pathname === tab.path;

            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive
                    ? "text-blue-500"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <IconComponent size={22} strokeWidth={2} />
                <span
                  className={`text-[11.5px] mt-1 ${
                    isActive
                      ? "font-semibold text-blue-500"
                      : "font-medium text-gray-500"
                  }`}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
