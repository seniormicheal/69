import { useState, useMemo, useEffect, useRef } from "react";
import { serviceLogo, countryFlag } from "../shared/utils";
import { Star } from 'lucide-react';

// Reusable UI for both desktop sidebar and mobile drawer
function SidebarContent({
  query, setQuery, uniqueServices, selectedService, setSelectedService,
  uniqueCountries, selectedCountry, setSelectedCountry, uniqueOperators,
  selectedOperator, setSelectedOperator, resetFilters, allServices,
  sort, setSort, showAvailableOnly, setShowAvailableOnly,
  // New props for favorites
  isLoggedIn,
  showFavoritesOnly,
  setShowFavoritesOnly,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const searchSuggestions = allServices
        .filter((s) =>
          `${s.service_persian} ${s.country_persian}`
            .toLowerCase()
            .includes(value.toLowerCase())
        )
        .map((s) => ({
          key: `${s.service_persian}-${s.country_persian}`,
          service: s.service_persian,
          country: s.country_persian,
        }))
        // Remove duplicates
        .filter((v, i, a) => a.findIndex((t) => t.key === v.key) === i)
        .slice(0, 5); // Limit to 5 suggestions

      setSuggestions(searchSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedService(suggestion.service);
    setSelectedCountry(suggestion.country);
    setQuery("");
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">
            جستجو و فیلتر
          </h3>
        </div>

        {/* Search with Autocomplete */}
        <div className="relative mb-6" ref={searchRef}>
          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="جستجوی سرویس یا کشور..."
            className="w-full p-4 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-700 rounded-xl shadow-lg border dark:border-gray-600 z-10 overflow-hidden">
              <ul>
                {suggestions.map((s, index) => (
                  <li key={`${s.key}-${index}`}>
                    <button
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full text-right px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="font-bold">{s.service}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        در {s.country}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sorting and Availability Controls */}
        <div className="space-y-4 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            {/* Favorites Toggle */}
            {isLoggedIn && (
                 <label className="flex items-center justify-between gap-2 cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <Star size={16} />
                        نمایش علاقه‌مندی‌ها
                    </span>
                    <div className="relative">
                        <input type="checkbox" checked={showFavoritesOnly} onChange={(e) => setShowFavoritesOnly(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                    </div>
                </label>
            )}
          {/* Availability Toggle */}
          <label className="flex items-center justify-between gap-2 cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span>فقط سرویس‌های موجود</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          </label>
          {/* Sorting Dropdown */}
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              مرتب‌سازی:
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
            >
              <option value="popular">محبوب‌ترین</option>
              <option value="rate_desc">نرخ موفقیت</option>
              <option value="price_asc">ارزان‌ترین</option>
              <option value="price_desc">گران‌ترین</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          {/* Service Filter */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                ۱
              </span>
              انتخاب سرویس
            </h4>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2 scrollbar-custom scrollbar-hide-x">
              {uniqueServices.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedService(selectedService === s ? "" : s);
                    setSelectedCountry("");
                    setSelectedOperator("");
                  }}
                  className={`w-full flex items-center gap-3 text-right px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedService === s
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-md"
                  }`}
                >
                  <img
                    src={serviceLogo(s)}
                    alt={s}
                    className="w-7 h-7 rounded-full shadow-sm"
                  />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Country Filter */}
          {selectedService && (
            <div className="animate-in slide-in-from-right duration-300">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  ۲
                </span>
                انتخاب کشور
              </h4>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2 scrollbar-custom scrollbar-hide-x">
                <button
                  onClick={() => setSelectedCountry("")}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedCountry === ""
                      ? "bg-blue-100 text-blue-800 shadow-md"
                      : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  همه کشورها
                </button>
                {uniqueCountries.map((c) => {
                  const countryData = allServices.find(
                    (s) => s && (s.country_persian || s.country) === c
                  );
                  const code = countryData ? countryData.country_code : "";
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCountry(selectedCountry === c ? "" : c);
                        setSelectedOperator("");
                      }}
                      className={`w-full flex items-center gap-3 text-right px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        selectedCountry === c
                          ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-md"
                      }`}
                    >
                      <img
                        src={countryFlag(code)}
                        alt={c}
                        className="w-7 h-auto rounded shadow-sm"
                      />
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Operator Filter */}
          {selectedCountry && (
            <div className="animate-in slide-in-from-right duration-300">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  ۳
                </span>
                انتخاب اپراتور
              </h4>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2 scrollbar-custom scrollbar-hide-x">
                <button
                  onClick={() => setSelectedOperator("")}
                  className={`w-full text-right px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedOperator === ""
                      ? "bg-purple-100 text-purple-800 shadow-md"
                      : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  همه اپراتورها
                </button>
                {uniqueOperators.map((o) => (
                  <button
                    key={o}
                    onClick={() =>
                      setSelectedOperator(selectedOperator === o ? "" : o)
                    }
                    className={`w-full text-right px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedOperator === o
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-md"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetFilters}
            className="w-full border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 rounded-xl py-3 text-sm font-semibold transition-all duration-200"
          >
            پاک‌سازی فیلترها
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar(props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4 flex justify-start">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-5 rounded-lg font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
        >
          فیلتر و مرتب‌سازی
        </button>
      </div>

      {/* Desktop sidebar (sticky) */}
      <aside className="hidden lg:block lg:col-span-1 sticky top-28 h-fit min-w-[280px]">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex animate-in fade-in duration-300">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-slate-50 dark:bg-gray-900 shadow-xl overflow-y-auto p-4 animate-in slide-in-from-right duration-300">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="mt-8">
              <SidebarContent {...props} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
