import CountdownTimer from "../shared/CountdownTimer";
import { toPersianNumber } from "../shared/utils";

export default function OrderNumberBox({ order, onCopy }) {
  // This logic ensures only one '+' is ever shown.
  // It removes any existing '+' from the number before prepending our own.
  const displayNumber = `+${String(order.number || "").replace(/\+/g, "")}`;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 text-center flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">شماره مجازی شما</h3>
        {/* The dir="ltr" ensures the + sign is on the left */}
        <div 
          className="font-mono text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900/50 border-2 border-dashed border-blue-300 dark:border-gray-600 p-4 sm:p-6 rounded-xl tracking-wider md:tracking-widest whitespace-nowrap" 
          dir="ltr"
        >
          {displayNumber}
        </div>
      </div>
      
      {/* This container is now always a horizontal row to save vertical space */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          onClick={() => onCopy(displayNumber)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex-grow shadow-md"
        >
          کپی شماره
        </button>
        <div className="text-center shrink-0">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">زمان باقی‌مانده</div>
            {order.expiresAt ? <CountdownTimer expiryTimestamp={order.expiresAt} /> : null}
        </div>
      </div>
    </div>
  );
}