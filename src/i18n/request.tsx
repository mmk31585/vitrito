// src/i18n/request.ts

// import { RequestConfig } from 'next-intl';

// پیکربندی locale برای درخواست‌ها
const config = {
  // بارگذاری locale از پارامترهای URL
  locales: ["fa", "en"],
  defaultLocale: "fa",
  // مسیر فایل‌های پیام‌های مختلف برای هر زبان
  messagesPath: "./src/messages", // مسیر فایل‌های پیام‌ها (باید برای هر زبان فایل‌های جداگانه داشته باشید)
};

export default config;
