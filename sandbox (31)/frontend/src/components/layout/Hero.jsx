import { ShieldCheck, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden pt-32 pb-16 sm:pb-24 lg:pb-32 px-4">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            شماره مجازی امن و فوری
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            بدون نیاز به سیم‌کارت، شماره مجازی اختصاصی خود را برای تلگرام، واتساپ، گوگل و سایر سرویس‌ها در کمتر از یک دقیقه دریافت کنید.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToServices}
            className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-shadow hover:shadow-xl"
          >
            مشاهده سرویس‌ها
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <Zap className="w-10 h-10 text-yellow-500" />,
              title: "تحویل فوری",
              description: "فعال‌سازی آنی شماره پس از پرداخت"
            },
            {
              icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
              title: "امن و خصوصی",
              description: "شماره‌های کاملا اختصاصی و مطمئن"
            },
            {
              icon: <Users className="w-10 h-10 text-blue-500" />,
              title: "پشتیبانی کامل",
              description: "تیم ما آماده پاسخگویی به شماست"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/30"
            >
              {feature.icon}
              <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}