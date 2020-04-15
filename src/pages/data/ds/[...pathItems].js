/**
 * @author sriram, aramsey
 *
 */

import React from "react";
import { useRouter } from "next/router";
import Listing from "../../../components/data/listing/Listing";
import constants from "../../../constants";
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
    const pathItems = router?.query?.pathItems;
    const routerPathname = router.pathname;
    // Remove the dynamic part of the path if it's there
    // (it won't be there if user navigates directly to /data/ds)
    const baseRoutingPath = routerPathname.replace(dynamicPathName, "");

    let path = "";
    if (pathItems && pathItems.length > 0) {
        path = constants.PATH_SEPARATOR + pathItems.join(constants.PATH_SEPARATOR);
    }

    const handlePathChange = (path) => {
        const encodedPath = getEncodedPath(path);
        router.push(`${baseRoutingPath}${dynamicPathName}`, `${baseRoutingPath}${encodedPath}`);
    };

    return (
        <Listing
            path={decodeURIComponent(path)}
            handlePathChange={handlePathChange}
            baseId="data"
        />
    );
}
