//https://github.com/vercel/next.js/blob/canary/examples
//https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (analytics_id, url) => {
    if (window.gtag) {
        window.gtag("config", analytics_id, {
            page_path: url,
        });
    }
};
