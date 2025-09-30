import { currencyToman } from "../shared/utils";
import Spinner from "./../shared/Spinner";

export default function OrderSummary({ service, onConfirm, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left: details */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border border-blue-100 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">جزئیات سفارش</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">سرویس:</span><span className="font-semibold dark:text-gray-200">{service.service_persian}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">کشور:</span><span className="font-semibold dark:text-gray-200">{service.country_persian}</span></div>
          <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">اپراتور:</span><span className="font-semibold dark:text-gray-200">{service.operator}</span></div>
        </div>
      </div>
      {/* Right: invoice */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border border-green-100 dark:border-gray-700 text-center flex flex-col justify-center">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">صورتحساب</h3>
        <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {currencyToman(service.price_toman)}
        </div>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Spinner className="w-6 h-6" />
          ) : (
            'تایید و پرداخت'
          )}
        </button>

      </div>
    </div>
  );
}