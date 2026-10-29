"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, CalendarDays, Heart, UserRoundCog } from "lucide-react";
import { useTabLayoutLanguage } from "@/hooks/languages/useTabLayoutLanguage";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTabLayoutLanguage();

  const TABS = [
    { name: t("home"), path: "/", icon: Store },
    { name: t("bookings"), path: "/bookings", icon: CalendarDays },
    { name: t("favorites"), path: "/favorites", icon: Heart },
    { name: t("settings"), path: "/settings", icon: UserRoundCog },
  ];

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center pb-24">
      <div className="w-full max-w-xl min-h-screen bg-white flex flex-col relative">
        {children}
      </div>

      <nav className="fixed bottom-4 left-0 right-0 max-w-xl mx-auto px-4 z-50">
        <div className=" bg-white border border-gray-200 rounded-2xl shadow-lg flex items-center justify-around py-2.5 px-3">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = pathname === tab.path;

            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`group flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                  isActive ? "text-blue-500" : "text-gray-400 "
                }`}
              >
                <IconComponent
                  size={22}
                  strokeWidth={2}
                  className="group-hover:text-gray-500"
                />
                <span
                  className={`text-[11.5px] mt-1 ${
                    isActive
                      ? "font-semibold text-blue-500"
                      : "font-semibold text-gray-400 group-hover:text-gray-500"
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
