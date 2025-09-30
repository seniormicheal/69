import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ErrorMessage from "../components/shared/ErrorMessage";
import DashboardCardSkeleton from "../components/dashboard/DashboardCardSkeleton";
import { toPersianNumber } from "../components/shared/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const statsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard-stats`, { headers });
      
      if (!statsRes.ok) {
        if(statsRes.status === 401) navigate('/login');
        throw new Error(`خطای سرور: ${statsRes.statusText}`);
      }
      
      const data = await statsRes.json();
      setStats(data.stats);

    } catch (e) {
      console.error("Dashboard fetch error:", e);
      setError(e.message || "امکان دریافت اطلاعات داشبورد وجود ندارد. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      );
    }
    if (error) {
      return <ErrorMessage title="خطا در بارگذاری داشبورد" message={error} onRetry={fetchData} />;
    }
    if (stats) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold">اعتبار فعلی</h3>
            <p className="text-3xl font-bold mt-1 text-blue-600 dark:text-blue-300">{toPersianNumber(stats.balance)} تومان</p>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold">مجموع هزینه</h3>
            <p className="text-3xl font-bold mt-1 text-blue-600 dark:text-blue-300">{toPersianNumber(stats.totalSpent)} تومان</p>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold">کل سفارش‌ها</h3>
            <p className="text-3xl font-bold mt-1 text-blue-600 dark:text-blue-300">{toPersianNumber(stats.totalOrders)}</p>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold">سفارشات فعال</h3>
            <p className="text-3xl font-bold mt-1 text-green-600">{toPersianNumber(stats.activeOrders)}</p>
          </div>
        </div>
      );
    }
    return <p className="text-center text-gray-500">اطلاعاتی برای نمایش وجود ندارد.</p>;
  };

  return (
    <DashboardLayout title="داشبورد">
      {renderContent()}
    </DashboardLayout>
  );
}