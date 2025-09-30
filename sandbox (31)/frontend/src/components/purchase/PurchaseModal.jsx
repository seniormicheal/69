import Spinner from "../shared/Spinner";
import { serviceLogo, countryFlag } from "../shared/utils";
import OrderSummary from "./OrderSummary";
import OrderNumberBox from "./OrderNumberBox";
import OrderCodeBox from "./OrderCodeBox";
import OrderSuccess from "./OrderSuccess";

export default function PurchaseModal({
  service,
  onClose,
  step,
  setStep,
  onPurchase,
  purchaseLoading,
  order,
  purchaseResult,
  copyToClipboard,
  handleCancelOrder,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
        {/* Header (only show for steps 1 and 2) */}
        {step < 3 && (
          <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-6 rounded-t-3xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={serviceLogo(service.service_persian)}
                  alt=""
                  className="w-14 h-14 rounded-2xl shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {service.service_persian}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                    <img
                      src={countryFlag(service.country_code)}
                      alt=""
                      className="w-6 h-auto rounded"
                    />
                    <span>{service.country_persian}</span>
                    {service.operator && (
                      <>
                        <span>•</span>
                        <span>{service.operator}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Body */}
        <div className={step < 3 ? "p-6" : ""}>
          {step === 1 && (
            <OrderSummary
              service={service}
              onConfirm={() => onPurchase(service)}
              isLoading={purchaseLoading}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* This full-screen spinner is now only for the brief transition */}
              {purchaseLoading && (
                <div className="text-center py-12">
                  <Spinner className="w-10 h-10 text-blue-600 mx-auto" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4">
                    در حال تهیه شماره...
                  </h3>
                </div>
              )}

              {order && !purchaseLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OrderNumberBox order={order} onCopy={copyToClipboard} />
                  <OrderCodeBox
                    order={order}
                    onCopyCode={copyToClipboard}
                    onCancel={handleCancelOrder}
                  />
                </div>
              )}

              {!purchaseLoading &&
                purchaseResult &&
                !purchaseResult.success && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-red-800 mb-2">
                      خرید ناموفق
                    </h3>
                    <p className="text-red-700 mb-4">{purchaseResult.error}</p>
                    <button
                      onClick={() => setStep(1)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                    >
                      تلاش مجدد
                    </button>
                  </div>
                )}
            </div>
          )}

          {step === 3 && order && (
            <OrderSuccess
              order={order}
              onCopyCode={copyToClipboard}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
