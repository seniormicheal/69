export default function DashboardCardSkeleton() {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mt-4"></div>
        </div>
    );
}