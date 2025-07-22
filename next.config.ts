// next.config.ts
import nextIntl from 'next-intl/plugin';

const withNextIntl = nextIntl({
  localeConfig: './src/i18n/request.ts', // مسیر فایل پیکربندی locale
});

const nextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
