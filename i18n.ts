import { getRequestConfig } from "next-intl/server";
import { i18nConfig } from "./src/i18n-config";
import { notFound } from "next/navigation";

// A simple in-memory cache to store loaded messages.
const messagesCache = new Map();

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!i18nConfig.locales.includes(locale)) {
        notFound();
    }

    // Check if the messages for the current locale are already in the cache
    if (messagesCache.has(locale)) {
        return {
            locale,
            messages: messagesCache.get(locale),
            // Configure `next-intl` to log a warning and return the key when a translation is not found.
            onMissingTranslation: ({ key }) => {
                console.warn(`Missing translation for key: "${key}"`);
                return key;
            },
        };
    }

    // Load the messages from the JSON file
    const messages = (await import(`./messages/${locale}.json`)).default;

    // Store the loaded messages in the cache
    messagesCache.set(locale, messages);

    return {
        locale,
        messages,
        // Configure `next-intl` to log a warning and return the key when a translation is not found.
        onMissingTranslation: ({ key }) => {
            console.warn(`Missing translation for key: "${key}"`);
            return key;
        },
    };
});
