import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-12">

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          {/* Column 1: Brand */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">شماره مجازی</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              خرید سریع، مطمئن و آسان شماره‌های مجازی برای سرویس‌های محبوب
              دنیا.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">لینک‌های مفید</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  قوانین و مقررات
                </a>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-600 transition-colors">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  پشتیبانی
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">ارتباط با ما</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              ایمیل: <a href="mailto:support@example.com" className="hover:text-blue-600">support@example.com</a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              تلگرام: <a href="https://t.me/example" target="_blank" className="hover:text-blue-600">@example</a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">ساعات پاسخگویی: ۹ صبح تا ۹ شب</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} شماره مجازی. کلیه حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}