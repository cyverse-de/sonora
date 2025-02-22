import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

let appCache = undefined;

export const createAppCache = () =>
    (appCache = createCache({
        key: "css",
    }));

export const EmotionCacheProvider = (props) => {
    return <CacheProvider value={appCache ?? createAppCache()} {...props} />;
};
