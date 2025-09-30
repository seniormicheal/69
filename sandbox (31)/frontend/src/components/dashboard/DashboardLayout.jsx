import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import useTheme from "../shared/useTheme";

export default function DashboardLayout({ title, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <MobileHeader title={title} onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4 items-center justify-between">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center gap-3">
             {/* Dark mode toggle */}
             <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="تغییر تم"
            >
               {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <img
              src="https://i.pravatar.cc/40"
              alt="user avatar"
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700"
            />
          </div>
        </header>

        {/* Main content area */}
        <main className="p-4 sm:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}