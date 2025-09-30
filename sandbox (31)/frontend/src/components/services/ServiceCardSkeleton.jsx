export default function ServiceCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-grow space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="my-4 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
      </div>
    </div>
  );
}
