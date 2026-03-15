"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User, Moon, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mounted ? (
              theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )
            ) : (
              // Placeholder with same dimensions to prevent layout shift
              <div className="w-5 h-5" />
            )}
          </button>

          {/* User Avatar */}
<button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
  <User className="w-5 h-5" />
</button>
        </div>
      </div>
    </nav>
  );
}