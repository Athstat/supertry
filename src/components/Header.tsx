import React, { useState } from "react";
import { Bell, Menu, Shield, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { SideDrawer } from "./SideDrawer";
import ScrummyLogo from "./branding/scrummy_logo";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const isProfileActive = location.pathname === "/profile";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-850/80 backdrop-blur-sm shadow-none mb-0 pb-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <ScrummyLogo />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            <button
              onClick={handleProfileClick}
              className={`p-2 transition-colors ${
                isProfileActive
                  ? "text-primary-500"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
              aria-label="Profile"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
