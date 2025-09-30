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
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setAllServices(data);
      if (!isInitialLoad.current) {
        toast.success("Service list updated!");
      }
    } catch (e) {
      console.error("Failed to load services:", e);
      setError("Error fetching services. Please check your internet connection.");
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
      className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans"
      dir="rtl"
    >
      <PullToRefreshIndicator
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
      />
      <Header />
      <main className="max-w-6xl mx-auto px-6 sm:px-8">
        <Hero />
        <PopularServices onServiceSelect={handleServiceSelect} />
        <div
          id="services-section"
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-8"
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
                title="Error Loading"
                message={error}
                onRetry={fetchServices}
              />
            ) : (
              <ServiceList
                services={filtered}
                visibleServices={visibleServices}
                loading={loading && !isRefreshing}
                visibleCount={visibleCount}
                setVisibleCount={setVisibleCount}
                openPurchase={(svc) => setSelectedForPurchase(svc)}
                favorites={favorites}
              />
            )}
          </div>
        </div>
      </main>
      {showGuestModal && (
        <GuestCheckoutModal
          service={selectedForPurchase}
          onClose={() => setShowGuestModal(false)}
        />
      )}
      {selectedForPurchase && (
        <PurchaseModal
          service={selectedForPurchase}
          onClose={() => setSelectedForPurchase(null)}
        />
      )}
      <Footer />
      <BackToTop />
    </div>
  );
}