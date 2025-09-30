import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RefreshCw } from 'lucide-react';
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { toPersianNumber } from "../components/shared/utils";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
            console.error("Failed to fetch orders, status:", res.status);
            if (res.status === 401) navigate('/login');
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchLower = searchQuery.toLowerCase();
      const statusMatch = statusFilter === 'all' || (order.status || '').toLowerCase() === statusFilter;
      const searchMatch = !searchQuery ||
        (order.service_name || '').toLowerCase().includes(searchLower) ||
        (order.number || '').includes(searchQuery) ||
        (order.country || '').toLowerCase().includes(searchLower);
      
      return statusMatch && searchMatch;
    });
  }, [orders, searchQuery, statusFilter]);
  
  // Corrected handleReorder function - no invalid imports needed
  const handleReorder = (order) => {
    const queryParams = new URLSearchParams({
        service: order.service_name,
        country: order.country,
    });
    navigate(`/?${queryParams.toString()}`);
  };

  const getStatusInfo = (status) => {
    switch (status) {
        case 'ACTIVE':
        case 'PENDING':
            return { text: 'در انتظار کد', className: 'bg-yellow-100 text-yellow-700' };
        case 'RECEIVED':
             return { text: 'کد دریافت شد', className: 'bg-green-100 text-green-700' };
        case 'CANCELED':
            return { text: 'لغو شده', className: 'bg-red-100 text-red-700' };
        case 'FINISHED':
            return { text: 'پایان یافته', className: 'bg-gray-100 text-gray-700' };
        default:
            return { text: status, className: 'bg-gray-100 text-gray-700' };
    }
  }

  return (
    <DashboardLayout title="سفارش‌ها">
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">تاریخچه سفارش‌ها</h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <input
                type="text"
                placeholder="جستجو در سرویس یا شماره..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending">در انتظار کد</option>
                <option value="received">کد دریافت شد</option>
                <option value="canceled">لغو شده</option>
                <option value="finished">پایان یافته</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              {orders.length > 0 ? "هیچ سفارشی با این فیلتر یافت نشد." : "هیچ سفارشی یافت نشد."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right min-w-[700px]">
                <thead>
                  <tr className="text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 px-4">سرویس</th>
                    <th className="py-2 px-4">شماره</th>
                    <th className="py-2 px-4">کد</th>
                    <th className="py-2 px-4">وضعیت</th>
                    <th className="py-2 px-4">قیمت</th>
                    <th className="py-2 px-4">تاریخ</th>
                    <th className="py-2 px-4">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                        <tr
                        key={order._id}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                        <td className="py-3 px-4">{order.service_name} ({order.country})</td>
                        <td className="py-3 px-4 font-mono text-left" dir="ltr">{order.number}</td>
                        <td className="py-3 px-4 font-mono">{order.smsCode || '-'}</td>
                        <td className="py-3 px-4">
                            <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}
                            >
                            {statusInfo.text}
                            </span>
                        </td>
                        <td className="py-3 px-4">{toPersianNumber(order.price)} تومان</td>
                        <td className="py-3 px-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                        <td className="py-3 px-4">
                            <button 
                                onClick={() => handleReorder(order)}
                                title="سفارش مجدد"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                <RefreshCw size={16} />
                                <span>مجدد</span>
                            </button>
                          </td>
                        </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}