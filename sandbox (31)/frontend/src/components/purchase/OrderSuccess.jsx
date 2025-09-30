import { CheckCircle2 } from 'lucide-react';
import { toPersianNumber } from '../shared/utils';

export default function OrderSuccess({ order, onCopyCode, onClose }) {
  return (
    <div className="text-center p-8 animate-in fade-in zoom-in-95 duration-300">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        سفارش تکمیل شد!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        کد فعال‌سازی برای شماره {toPersianNumber(order.number)} دریافت شد.
      </p>

      <div className="bg-gray-100 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 mb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">کد فعال‌سازی شما:</p>
        <div className="font-mono text-5xl font-bold text-gray-800 dark:text-gray-200 tracking-widest">
          {order.smsCode}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onCopyCode(order.smsCode)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          کپی کردن کد
        </button>
        <button
          onClick={onClose}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          بستن
        </button>
      </div>
    </div>
  );
}