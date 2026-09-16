"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Film, Building2, CalendarClock } from "lucide-react";
import MoviesAdminTab from "@/components/admin/MoviesAdminTab";
import TheatersAdminTab from "@/components/admin/TheatersAdminTab";
import ShowtimesAdminTab from "@/components/admin/ShowtimesAdminTab";

type Tab = "movies" | "theaters" | "showtimes";

const TABS: { id: Tab; label: string; icon: typeof Film }[] = [
  { id: "movies", label: "Movies", icon: Film },
  { id: "theaters", label: "Theaters", icon: Building2 },
  { id: "showtimes", label: "Showtimes", icon: CalendarClock },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("movies");

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="bg-bms-darker text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive ? "bg-bms-red text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "movies" && <MoviesAdminTab />}
        {activeTab === "theaters" && <TheatersAdminTab />}
        {activeTab === "showtimes" && <ShowtimesAdminTab />}
      </div>
    </div>
  );
}
