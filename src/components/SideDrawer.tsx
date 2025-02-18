import { Search, Settings, HelpCircle, Users, X, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Search, label: "Players", path: "/players" },
    { icon: Settings, label: "Settings", path: "#" },
    { icon: HelpCircle, label: "Support", path: "#" },
    { icon: Share2, label: "Invite Friends", path: "#" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-dark-850 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 py-2">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => handleNavigation(path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
