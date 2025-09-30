import ServiceCard from "./ServiceCard";
import ServiceCardSkeleton from "./ServiceCardSkeleton";
import { toPersianNumber } from "../shared/utils";

export default function ServiceList({
  services,
  visibleServices,
  loading,
  visibleCount,
  setVisibleCount,
  openPurchase,
  quickPurchase,
  isLoggedIn,
  favorites,
  onToggleFavorite,
  resetFilters,
}) {
  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <ServiceCardSkeleton key={index} />
            ))}
        </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">سرویسی یافت نشد</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">متاسفانه هیچ سرویسی با معیارهای انتخابی شما پیدا نشد</p>
        <button onClick={resetFilters} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
          پاک کردن فیلترها
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:flex mb-6 items-center justify-between gap-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-md border border-white/50 dark:border-gray-700/50">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {toPersianNumber(services.length)} سرویس موجود
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visibleServices.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            openPurchase={openPurchase}
            quickPurchase={quickPurchase}
            isLoggedIn={isLoggedIn}
            isFavorite={favorites.includes(s.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* This is the corrected section with enhanced styling */}
      {services.length > visibleCount && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + 12)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            نمایش {toPersianNumber(Math.min(12, services.length - visibleCount))}{" "}
            سرویس بیشتر
          </button>
        </div>
      )}
    </>
  );
}