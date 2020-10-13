export const GA_TRACKING_ID = "G-YXTRXCKR7T";

//https://github.com/vercel/next.js/blob/canary/examples
//https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
    if (window.gtag) {
        window.gtag("config", GA_TRACKING_ID, {
            page_path: url,
        });
    }
};
