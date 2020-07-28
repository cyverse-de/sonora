/**
 * @author sriram, aramsey
 *
 */

import React from "react";
import { useRouter } from "next/router";
import Listing from "../../../components/data/listing/Listing";
import { getEncodedPath } from "../../../components/data/utils";

/**
 * This variable value needs to match the name of this file for the routing to work
 * properly without doing a hard refresh.
 *
 * See https://nextjs.org/docs/api-reference/next/router#usage and
 * https://nextjs.org/docs/api-reference/next/link#dynamic-routes
 * @type {string}
 */
const dynamicPathName = "/[...pathItems]";

/**
 *
 * Handle routing to /data/ds/pathInDataStore
 *
 */
export default function DataStore() {
    const router = useRouter();
    const routerPathname = router.pathname;
    const fullPath = router.asPath;
    // Remove the dynamic part of the path if it's there
    // (it won't be there if user navigates directly to /data/ds)
    const baseRoutingPath = routerPathname.replace(dynamicPathName, "");
    const path = fullPath.replace(baseRoutingPath, "");

    const handlePathChange = (path) => {
        const encodedPath = getEncodedPath(path);
        router.push(
            `${baseRoutingPath}${dynamicPathName}`,
            `${baseRoutingPath}${encodedPath}`
        );
    };

    return (
        <Listing
            path={decodeURIComponent(path)}
            handlePathChange={handlePathChange}
            baseId="data"
        />
    );
}

DataStore.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};

    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, namespacesRequired: ["data"] };
};
