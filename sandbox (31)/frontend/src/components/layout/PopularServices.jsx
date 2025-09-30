import { serviceLogo } from '../shared/utils';

const popularServicesList = [
  { name: 'تلگرام', key: 'تلگرام' },
  { name: 'واتساپ', key: 'واتساپ' },
  { name: 'اینستاگرام', key: 'اینستاگرام' },
  { name: 'گوگل', key: 'گوگل' },
  { name: 'توییتر', key: 'توییتر' },
  { name: 'فیسبوک', key: 'فیسبوک' },
  { name: 'تیک تاک', key: 'تیک تاک' },
  { name: 'اپل', key: 'اپل' },
];

export default function PopularServices({ onServiceSelect }) {
  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
        انتخاب سریع سرویس محبوب شما
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {popularServicesList.map((service) => (
          <button
            key={service.key}
            onClick={() => onServiceSelect(service.name)}
            className="group flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src={serviceLogo(service.name)}
              alt={service.name}
              className="w-12 h-12 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110"
            />
            <span className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {service.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}