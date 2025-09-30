import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const faqData = [
  {
    question: 'شماره مجازی چیست و چه کاربردی دارد؟',
    answer: 'شماره مجازی یک شماره تلفن است که به سیم‌کارت فیزیکی متصل نیست. از آن می‌توانید برای ثبت‌نام و فعال‌سازی حساب در شبکه‌های اجتماعی و سرویس‌های آنلاین مانند تلگرام، واتساپ و گوگل استفاده کنید تا حریم خصوصی شماره اصلی شما حفظ شود.',
  },
  {
    question: 'آیا شماره‌ها اختصاصی هستند؟',
    answer: 'بله، تمامی شماره‌های ارائه شده کاملا اختصاصی بوده و پس از خرید، فقط در اختیار شما قرار می‌گیرند. پس از اتمام زمان استفاده، شماره از سیستم حذف می‌شود.',
  },
  {
    question: 'چگونه می‌توانم هزینه شماره را پرداخت کنم؟',
    answer: 'شما می‌توانید با افزایش اعتبار حساب کاربری خود از طریق درگاه پرداخت امن، هزینه شماره‌ها را از اعتبار خود کسر کنید.',
  },
  {
    question: 'اگر کد فعال‌سازی را دریافت نکردم چه کاری باید انجام دهم؟',
    answer: 'در صورتی که در زمان مشخص شده کد را دریافت نکردید، می‌توانید سفارش را لغو کنید. پس از لغو، هزینه به صورت کامل به اعتبار حساب شما بازگردانده می‌شود و می‌توانید شماره دیگری را امتحان کنید.',
  },
  {
    question: 'آیا می‌توانم از یک شماره برای چندین سرویس استفاده کنم؟',
    answer: 'هر شماره مجازی برای یک سرویس خاص خریداری می‌شود. برای ثبت‌نام در سرویس‌های مختلف، باید شماره‌های جداگانه تهیه کنید.',
  },
];

const FaqItem = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-right text-lg font-semibold text-gray-800 dark:text-gray-200"
      >
        <span>{item.question}</span>
        <ChevronDown
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen mt-4' : 'max-h-0'}`}
      >
        <p className="text-gray-600 dark:text-gray-400 pr-2">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 font-sans" dir="rtl">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                سوالات متداول
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                پاسخ به سوالات رایج شما در مورد سرویس شماره مجازی.
            </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}