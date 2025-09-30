import { Menu } from "lucide-react";
import useTheme from "../shared/useTheme";

export default function MobileHeader({ title, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between gap-4">
      {/* Left side: Title */}
      <h1 className="text-lg font-bold">{title}</h1>

      {/* Right side: Controls */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 w-10 h-10 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          title="تغییر تم"
        >
           {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 w-10 h-10 flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}