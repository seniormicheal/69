import { User, UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuestCheckoutModal({ onGuestContinue, onClose, service }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl w-full max-w-md shadow-2xl border border-white/50 dark:border-gray-700/50 animate-in zoom-in-95 duration-300 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          ادامه به عنوان مهمان یا ورود؟
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          با ایجاد حساب کاربری می‌توانید سفارشات خود را پیگیری کرده و از خرید سریع در آینده بهره‌مند شوید.
        </p>

        <div className="space-y-4">
            <button
                onClick={onGuestContinue}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
                <ArrowLeft size={20} />
                <span>ادامه به عنوان مهمان</span>
            </button>
            <Link to="/login" className="w-full flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                 <User size={20} />
                 <span>ورود به حساب کاربری</span>
            </Link>
             <Link to="/register" className="w-full flex items-center justify-center gap-3 text-sm text-blue-600 hover:underline">
                 <span>حساب کاربری ندارید؟ ثبت‌نام کنید</span>
             </Link>
        </div>
         <button onClick={onClose} className="mt-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            انصراف
        </button>
      </div>
    </div>
  );
}