// next.config.ts
import nextIntl from 'next-intl/plugin';

const withNextIntl = nextIntl({
  localeConfig: './src/i18n/request.ts', // مسیر فایل پیکربندی locale
});

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fa'], // زبان‌های پشتیبانی شده
    defaultLocale: 'fa',    // زبان پیش‌فرض
  },
};

export default withNextIntl(nextConfig);
