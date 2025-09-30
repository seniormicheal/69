import Spinner from "../shared/Spinner";

export default function OrderCodeBox({ order, onCopyCode, onCancel }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border border-green-100 dark:border-gray-700 text-center flex flex-col justify-between">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">کد فعال‌سازی</h3>
      {order.smsCode ? (
        <div className="animate-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800/50 dark:to-emerald-800/50 border-2 border-green-300 dark:border-green-600 rounded-2xl p-8 mb-4">
            <div className="font-mono text-5xl font-bold text-green-800 dark:text-green-200 tracking-widest">
              {order.smsCode}
            </div>
          </div>
          <button
            onClick={() => onCopyCode(order.smsCode)}
            className="text-sm border px-4 py-2 rounded-lg mt-3 border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            کپی کردن کد
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-white dark:bg-gray-900/50 border-2 border-dashed border-green-300 dark:border-gray-600 rounded-2xl p-8 mb-4">
            <Spinner className="w-12 h-12 mx-auto text-green-600" />
          </div>
          <button
            onClick={() => onCancel(order.id)}
            className="w-full text-center text-sm font-semibold text-red-600 hover:bg-red-100/50 dark:text-red-500 dark:hover:bg-red-900/30 py-2 rounded-lg transition-colors"
          >
            لغو سفارش
          </button>
        </div>
      )}
    </div>
  );
}