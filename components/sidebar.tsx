"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Pill,
  Search,
  TrendingUp,
  Bell,
  FileArchive,
  MessageCircle,
  Heart,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/reports", icon: FileText, label: "Report Analyzer" },
    { href: "/dashboard/medicine-safety", icon: Pill, label: "Medicine Safety" },
    { href: "/dashboard/medicine-database", icon: Search, label: "Medicine Database" },
    { href: "/dashboard/health-trends", icon: TrendingUp, label: "Health Trends" },
    { href: "/dashboard/reminders", icon: Bell, label: "Reminders" },
    { href: "/dashboard/health-records", icon: FileArchive, label: "Health Records" },
    { href: "/dashboard/ai-pharmacist", icon: MessageCircle, label: "AI Pharmacist" },
    { href: "/dashboard/emergency-card", icon: Heart, label: "Emergency Health Card" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-secondary text-secondary-foreground border-r transition-all duration-300 z-40",
          open ? "w-64" : "w-0 lg:w-64 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span>DocTalk</span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary/80"
                )}
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setOpen(false);
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                {open && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
