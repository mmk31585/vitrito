import nextIntl from 'next-intl/plugin';

const nextConfig = {
  reactStrictMode: true,
  // سایر تنظیمات دلخواه شما
};

export default nextIntl({
  ...nextConfig,
  localeConfig: './src/i18n/request.tsx',
});
