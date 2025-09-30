import { ArrowDown, Loader } from 'lucide-react';

export default function PullToRefreshIndicator({ pullDistance, isRefreshing }) {
  const isVisible = pullDistance > 0 || isRefreshing;
  const opacity = Math.min(pullDistance / 100, 1);
  const rotation = Math.min(pullDistance, 100) * 1.8; // Rotate up to 180 degrees

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-20 flex justify-center items-center z-30 pointer-events-none">
        <div
            className={`flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg transition-transform duration-200 ${isRefreshing ? 'scale-100' : 'scale-75'}`}
            style={{ opacity: isRefreshing ? 1 : opacity }}
        >
            {isRefreshing ? (
                <Loader className="animate-spin text-blue-600" />
            ) : (
                <ArrowDown
                    className="text-gray-500 dark:text-gray-400 transition-transform duration-200"
                    style={{ transform: `rotate(${rotation}deg)` }}
                />
            )}
        </div>
    </div>
  );
}