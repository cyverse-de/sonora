const path = require("path");

const isProduction = process.env.NODE_ENV === "production";
const localePath =
    typeof window === "undefined"
        ? path.resolve("./public/static/locales")
        : "/static/locales";

module.exports = {
    debug: !isProduction,
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
        /**
         * Turn off automatic locale detection based on header (Accept-Language) or domain
         */
        localeDetection: false,
    },
    fallbackLng: ["en"],
    localePath,
    /**
     * updates to your translation JSON files without having
     * to restart your development server
     */
    reloadOnPrerender: !isProduction,
};
