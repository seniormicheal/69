import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({
  title = "خطایی رخ داد",
  message,
  onRetry,
}) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/30 rounded-2xl p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
        {title}
      </h3>
      <p className="text-red-700 dark:text-red-400 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
        >
          تلاش مجدد
        </button>
      )}
    </div>
  );
}
