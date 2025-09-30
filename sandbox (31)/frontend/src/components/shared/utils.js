export const toPersianNumber = (num) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return String(num || "").replace(/\d/g, (d) => persianDigits[+d]);
};

export const currencyToman = (n) => `${toPersianNumber(n)} تومان`;

export const serviceLogo = (serviceKey = "") => {
  const s = (serviceKey || "").toLowerCase();
  const domainMap = {
    'تلگرام': 'telegram.org',
    'واتساپ': 'whatsapp.com',
    'گوگل': 'google.com',
    'یوتیوب': 'youtube.com',
    'فیسبوک': 'facebook.com',
    'اینستاگرام': 'instagram.com',
    'آمازون': 'amazon.com',
    'اپل': 'apple.com',
    'توییتر': 'twitter.com',
    'تیک تاک': 'tiktok.com',
  };
  const domain = domainMap[s] || `${s.replace(/\s+/g, '')}.com`;
  return `https://logo.clearbit.com/${domain}`;
};

export const countryFlag = (countryCode = "") =>
  countryCode ? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png` : "";
