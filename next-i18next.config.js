const path = require("path");

module.exports = {
    debug: true,
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
        /**
         * Turn off automatic locale detection based on header (Accept-Language) or domain
         */
        localeDetection: false,
    },
    // fallbackLng: ["en"],
    localePath: path.resolve("./public/static/locales"),
    /**
     * updates to your translation JSON files without having
     * to restart your development server
     */
    reloadOnPrerender: process.env.NODE_ENV !== "production",
};
