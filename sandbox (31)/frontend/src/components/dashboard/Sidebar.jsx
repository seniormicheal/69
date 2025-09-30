import { NavLink, useNavigate } from "react-router-dom";
import { Home, ShoppingBag, Settings, LogOut, ArrowLeft, X } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('authChange'));
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          پنل کاربری
        </h2>
        <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Close menu"
        >
            <X size={20} />
        </button>
      </div>


      <nav className="flex flex-col gap-2 flex-grow">
        <NavLink to="/dashboard" className={linkClasses} end>
          <Home size={18} /> داشبورد
        </NavLink>
        <NavLink to="/orders" className={linkClasses}>
          <ShoppingBag size={18} /> سفارش‌ها
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          <Settings size={18} /> تنظیمات
        </NavLink>
        <NavLink to="/" className={linkClasses}>
            <ArrowLeft size={18} /> بازگشت به سایت
        </NavLink>
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 transition"
        >
          <LogOut size={18} /> خروج از حساب
        </button>
      </div>
    </>
  );

  return (
    <>
        {/* Mobile Overlay */}
        <div
            onClick={() => setIsOpen(false)}
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        />

        {/* Sidebar */}
        <aside
            className={`fixed md:relative inset-y-0 right-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 p-4 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            {sidebarContent}
        </aside>
    </>
  );
}