import createMiddleware from "next-intl/middleware";

export default createMiddleware({
    locales: ["en", "fa"],
    defaultLocale: "fa",
});

export const config = {
    matcher: [
        "/",
        "/(fa|en)/:path*",
        "/((?!_next/static|.*\\..*|_next/image|favicon.ico|sw.js|login|signup).*)",
    ],
};
