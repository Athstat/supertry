import { useState } from "react";
import { Menu, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { SideDrawer } from "./SideDrawer";
import ScrummyLogoHorizontal from "./branding/scrummy_logo_horizontal";
import { isInProduction } from "../utils/webUtils";
import BetaTag from "./branding/BetaTag";
import NotificationsBell from "./notifications/NotificationsBell";

export function Header() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isInQa = isInProduction() !== true;

  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleInAppMessages = () => {
    navigate('/in-app-messages');
  }

  const isProfileActive = location.pathname === "/profile";

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-850/80 backdrop-blur-sm shadow-none mb-0 pb-0">
        <div className="container mx-auto px-4 h-16 overflow-hidden flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <div
              className="flex flex-row overflow-hidden items-start justify-start cursor-pointer"
              onClick={() => navigate("/dashboard")}
              tabIndex={0}
              aria-label="Navigate to home"
            >
              <ScrummyLogoHorizontal className="" />
            </div>

            { isInQa && <BetaTag />}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <NotificationsBell 
              onClick={handleInAppMessages}
            />

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
