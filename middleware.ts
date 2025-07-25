import createMiddleware from "next-intl/middleware";
import { i18nConfig } from "./src/i18n-config";

export default createMiddleware({
    ...i18nConfig,
});

export const config = {
    matcher: [
        "/",
        "/(fa|en)/:path*",
        "/((?!_next/static|.*\\..*|_next/image|favicon.ico|sw.js|login|signup).*)",
    ],
};
