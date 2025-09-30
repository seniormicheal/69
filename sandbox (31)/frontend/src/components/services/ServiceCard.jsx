import { Heart, Zap, ShieldCheck } from 'lucide-react';
import { toPersianNumber } from '../shared/utils';

export default function ServiceCard({
  service,
  onPurchase,
  onQuickPurchase,
  isLoggedIn,
  isFavorite,
  onToggleFavorite
}) {
  const isAvailable = service.available;

  return (
    <div className="group relative p-6 card hover:shadow-xl transition-all duration-300">
      {/* Favorite Button */}
      {isLoggedIn && (
        <button
          onClick={() => onToggleFavorite(service.id)}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 
            hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        >
          <Heart
            size={16}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      )}

      {/* Service Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {service.service_persian || service.service}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {service.country_persian || service.country}
              {service.operator && ` - ${service.operator}`}
            </p>
          </div>
          {service.success_rate && (
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
              <ShieldCheck size={14} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                {toPersianNumber(service.success_rate)}٪
              </span>
            </div>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">قیمت</span>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {toPersianNumber(service.price_toman)} تومان
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && isAvailable && (
              <button
                onClick={() => onQuickPurchase(service)}
                title="خرید سریع"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30 
                  text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
              >
                <Zap size={18} />
              </button>
            )}
            <button
              onClick={() => onPurchase(service)}
              disabled={!isAvailable}
              className={`px-5 h-10 rounded-xl font-medium text-sm transition-all duration-200 
                ${
                  isAvailable
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
            >
              {isAvailable ? 'خرید' : 'ناموجود'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}