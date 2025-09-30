import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

// Components
import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";
import PopularServices from "../components/layout/PopularServices";
import FilterSidebar from "../components/layout/FilterSidebar";
import BackToTop from "../components/shared/BackToTop";
import ServiceList from "../components/services/ServiceList";
import PurchaseModal from "../components/purchase/PurchaseModal";
import GuestCheckoutModal from "../components/purchase/GuestCheckoutModal";
import Footer from "../components/layout/Footer";
import ErrorMessage from "../components/shared/ErrorMessage";
import usePullToRefresh from "../components/shared/usePullToRefresh";
import PullToRefreshIndicator from "../components/shared/PullToRefreshIndicator";
import { toPersianNumber } from "../components/shared/utils";

export default function VirtualNumbersHomepage() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [sort, setSort] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(12);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedForPurchase, setSelectedForPurchase] = useState(null);
  const [purchaseStep, setPurchaseStep] = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const pollingInterval = useRef(null);
  const isInitialLoad = useRef(true);

  // THIS IS THE MISSING LINE THAT CAUSED THE ERROR
  const [showGuestModal, setShowGuestModal] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!token);
      if (user) {
        setFavorites(JSON.parse(user).favoriteServices || []);
      } else {
        setFavorites([]);
      }
    };
    checkUser();
    window.addEventListener("authChange", checkUser);
    return () => window.removeEventListener("authChange", checkUser);
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/services`
      );
      if (!res.ok) throw new Error("پاسخ شبکه ناموفق بود");
      const data = await res.json();
      setAllServices(data);
      if (!isInitialLoad.current) {
        toast.success("لیست سرویس‌ها به‌روز شد!");
      }
    } catch (e) {
      console.error("Failed to load services:", e);
      setError(
        "خطا در دریافت لیست سرویس‌ها. لطفا اتصال اینترنت خود را بررسی کنید."
      );
    } finally {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const { isRefreshing, pullDistance } = usePullToRefresh(fetchServices);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get("service");
    const countryParam = params.get("country");
    if (serviceParam) {
      setSelectedService(serviceParam);
    }
    if (countryParam) {
      setSelectedCountry(countryParam);
    }
  }, [location.search]);

  const uniqueServices = useMemo(() => {
    const serviceMap = new Map();
    allServices.forEach((s) => {
      if (!s) return;
      const name = s.service_persian || s.service;
      if (!name) return;
      if (!serviceMap.has(name) || s.priority < serviceMap.get(name).priority) {
        serviceMap.set(name, s);
      }
    });
    return [...serviceMap.values()]
      .sort((a, b) => (a.priority || 99) - (b.priority || 99))
      .map((s) => s.service_persian || s.service);
  }, [allServices]);

  const uniqueCountries = useMemo(() => {
    if (!selectedService) return [];
    const relevant = allServices.filter(
      (s) => (s.service_persian || s.service) === selectedService
    );
    return [...new Set(relevant.map((x) => x.country_persian || x.country))]
      .filter(Boolean)
      .sort();
  }, [allServices, selectedService]);

  const uniqueOperators = useMemo(() => {
    if (!selectedService || !selectedCountry) return [];
    const relevant = allServices.filter(
      (s) =>
        (s.service_persian || s.service) === selectedService &&
        (s.country_persian || s.country) === selectedCountry
    );
    return [...new Set(relevant.map((x) => x.operator || ""))]
      .filter(Boolean)
      .sort();
  }, [allServices, selectedService, selectedCountry]);

  const filtered = useMemo(() => {
    let services = allServices.filter(Boolean);
    if (isLoggedIn && showFavoritesOnly) {
      services = services.filter((s) => favorites.includes(s.id));
    }
    if (showAvailableOnly) {
      services = services.filter((s) => s.available);
    }
    if (query) {
      services = services.filter((s) =>
        `${s.service} ${s.country_persian} ${s.service_persian}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }
    if (selectedService) {
      services = services.filter(
        (s) => (s.service_persian || s.service) === selectedService
      );
    }
    if (selectedCountry) {
      services = services.filter(
        (s) => (s.country_persian || s.country) === selectedCountry
      );
    }
    if (selectedOperator) {
      services = services.filter((s) => s.operator === selectedOperator);
    }
    const sortedServices = [...services];
    if (sort === "rate_desc") {
      sortedServices.sort(
        (a, b) => (b.success_rate || 0) - (a.success_rate || 0)
      );
    } else if (sort === "price_asc") {
      sortedServices.sort((a, b) => a.price_toman - b.price_toman);
    } else if (sort === "price_desc") {
      sortedServices.sort((a, b) => b.price_toman - a.price_toman);
    }
    return sortedServices;
  }, [
    allServices,
    query,
    selectedService,
    selectedCountry,
    selectedOperator,
    sort,
    showAvailableOnly,
    isLoggedIn,
    showFavoritesOnly,
    favorites,
  ]);

  const visibleServices = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const handleServiceSelect = (serviceName) => {
    setSelectedService(serviceName);
    setSelectedCountry("");
    setSelectedOperator("");
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openPurchase = (svc) => {
    setSelectedForPurchase(svc);
    setPurchaseStep(1);
    setPurchaseResult(null);
    setActiveOrder(null);
    if (!isLoggedIn) {
      setShowGuestModal(true);
    } else {
      // For logged-in users, directly show the purchase modal
      // This logic assumes you might have different flows later
    }
  };

  const doPurchase = async (svc) => {
    if (!isLoggedIn) {
      // This case is now handled by the guest modal, but we keep the logic
      handleGuestPurchase(svc);
      return;
    }

    if (!svc) return;
    setPurchaseLoading(true);

    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ service_id: svc.id }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "خطا در خرید");
      }
      const data = await res.json();
      setActiveOrder({
        id: data.order_id,
        number: data.number,
        status: "PENDING",
        smsCode: null,
        expiresAt: data.expiryTimestamp,
      });
      setPurchaseStep(2);
    } catch (e) {
      toast.error(e.message || "خرید انجام نشد. لطفا دوباره تلاش کنید.");
      setPurchaseResult({ success: false, error: e.message });
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleGuestPurchase = async (svc) => {
    if (!svc) return;
    setPurchaseLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/purchase-guest`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service_id: svc.id }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "خطا در خرید");
      }
      const data = await res.json();
      localStorage.setItem(
        "guestOrder",
        JSON.stringify({ guestId: data.guestId, orderId: data.order_id })
      );
      setActiveOrder({
        id: data.order_id,
        guestId: data.guestId,
        number: data.number,
        status: "PENDING",
        smsCode: null,
        expiresAt: data.expiryTimestamp,
      });
      setPurchaseStep(2);
    } catch (e) {
      toast.error(e.message || "خرید انجام نشد. لطفا دوباره تلاش کنید.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleQuickPurchase = (service) => {
    setSelectedForPurchase(service);
    doPurchase(service);
  };

  const handleToggleFavorite = async (serviceId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("برای استفاده از این قابلیت، لطفا وارد شوید.");
      return;
    }
    const isCurrentlyFavorite = favorites.includes(serviceId);
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== serviceId)
      : [...favorites, serviceId];
    setFavorites(newFavorites);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/favorites/toggle`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ serviceId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setFavorites(data.favorites);
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.favoriteServices = data.favorites;
        localStorage.setItem("user", JSON.stringify(user));
      }
      toast.success(
        isCurrentlyFavorite
          ? "از علاقه‌مندی‌ها حذف شد"
          : "به علاقه‌مندی‌ها اضافه شد"
      );
    } catch (error) {
      toast.error("خطا در به‌روزرسانی علاقه‌مندی‌ها");
      setFavorites(favorites);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!orderId) return;
    setPurchaseLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cancel-order/${orderId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("خطا در لغو سفارش");
      toast.success("سفارش لغو شد و هزینه بازگشت داده شد.");
      closeModal();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setPurchaseLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedForPurchase(null);
    if (pollingInterval.current) clearInterval(pollingInterval.current);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("کپی شد!");
    } catch {
      toast.error("خطا در کپی کردن");
    }
  };

  useEffect(() => {
    if (!activeOrder?.id || purchaseStep !== 2) return;
    const checkStatus = async () => {
      const { id, guestId } = activeOrder;
      const url = guestId
        ? `${
            import.meta.env.VITE_API_BASE_URL
          }/api/check-order-guest/${guestId}/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/check-order/${id}`;
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (data.smsCode) {
          setActiveOrder((prev) => ({
            ...prev,
            smsCode: data.smsCode,
            status: "RECEIVED",
          }));
          setPurchaseStep(3);
          if (guestId) localStorage.removeItem("guestOrder");
          clearInterval(pollingInterval.current);
          return;
        }
        if (activeOrder.status !== data.status) {
          setActiveOrder((prev) => ({
            ...prev,
            status: data.status,
            expiresAt: data.expiryTimestamp,
          }));
        }
        const isOrderDone = ["FINISHED", "CANCELED"].includes(data.status);
        const isExpired = new Date().getTime() > data.expiryTimestamp;
        if (isOrderDone || isExpired) {
          if (guestId) localStorage.removeItem("guestOrder");
          clearInterval(pollingInterval.current);
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    };
    checkStatus();
    pollingInterval.current = setInterval(checkStatus, 5000);
    return () => clearInterval(pollingInterval.current);
  }, [activeOrder, purchaseStep]);

  const resetFilters = () => {
    setQuery("");
    setSelectedService("");
    setSelectedCountry("");
    setSelectedOperator("");
    setSort("popular");
    setShowAvailableOnly(false);
    setShowFavoritesOnly(false);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 font-sans"
      dir="rtl"
    >
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <Hero />
        <PopularServices onServiceSelect={handleServiceSelect} />
        <div
          id="services-section"
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8 border-t border-gray-200 dark:border-gray-700/50"
        >
          <FilterSidebar
            query={query}
            setQuery={setQuery}
            uniqueServices={uniqueServices}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            uniqueCountries={uniqueCountries}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            uniqueOperators={uniqueOperators}
            selectedOperator={selectedOperator}
            setSelectedOperator={setSelectedOperator}
            resetFilters={resetFilters}
            allServices={allServices}
            sort={sort}
            setSort={setSort}
            showAvailableOnly={showAvailableOnly}
            setShowAvailableOnly={setShowAvailableOnly}
            isLoggedIn={isLoggedIn}
            showFavoritesOnly={showFavoritesOnly}
            setShowFavoritesOnly={setShowFavoritesOnly}
          />
          <div className="lg:col-span-3">
            {error ? (
              <ErrorMessage
                title="خطا در بارگذاری"
                message={error}
                onRetry={fetchServices}
              />
            ) : (
              <>
                <div className="mb-6 lg:hidden p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-md border border-white/50 dark:border-gray-700/50">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {toPersianNumber(filtered.length)} سرویس موجود
                  </h3>
                </div>
                <ServiceList
                  services={filtered}
                  visibleServices={visibleServices}
                  loading={loading && !isRefreshing}
                  visibleCount={visibleCount}
                  setVisibleCount={setVisibleCount}
                  openPurchase={openPurchase}
                  quickPurchase={handleQuickPurchase}
                  isLoggedIn={isLoggedIn}
                  resetFilters={resetFilters}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {showGuestModal && (
        <GuestCheckoutModal
          service={selectedForPurchase}
          onClose={() => setShowGuestModal(false)}
          onGuestContinue={() => {
            setShowGuestModal(false);
            handleGuestPurchase(selectedForPurchase);
          }}
        />
      )}

      {selectedForPurchase && !showGuestModal && (
        <PurchaseModal
          service={selectedForPurchase}
          onClose={closeModal}
          step={purchaseStep}
          setStep={setPurchaseStep}
          onPurchase={doPurchase}
          purchaseLoading={purchaseLoading}
          order={activeOrder}
          purchaseResult={purchaseResult}
          copyToClipboard={copyToClipboard}
          handleCancelOrder={handleCancelOrder}
        />
      )}
      <Footer />
      <BackToTop />
    </div>
  );
}
