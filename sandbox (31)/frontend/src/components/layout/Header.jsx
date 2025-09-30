import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTheme from "../shared/useTheme";
import { User, LogIn, Menu, X } from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    checkUser();
    window.addEventListener('authChange', checkUser);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('authChange', checkUser);
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg transform transition-all duration-300 group-hover:scale-105">
              <span className="drop-shadow-sm">N</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              شماره مجازی
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              سریع، مطمئن، آسان
            </p>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="تغییر تم"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User size={18} />
                <span className="text-sm font-medium">{user.username}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in slide-up">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    داشبورد
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("user");
                      window.dispatchEvent(new Event('authChange'));
                      navigate("/");
                    }}
                    className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    خروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
            >
              <LogIn size={18} />
              ورود
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}