/**
 * @author sriram, aramsey
 *
 */

import React from "react";
import { useRouter } from "next/router";
import Listing from "../../../components/data/listing/Listing";
import constants from "../../../constants";
import { getEncodedPath, getStorageIdFromPath } from "../../../components/data/utils";
import NavigationConstants from "../../../common/NavigationConstants";

/**
 * compute routing path from selected storage and path
 *
 * @param {string} routerPathname - pathname returned by the nextjs router object
 * @returns {string} - routing path to be used by the nextjs router
 */
function getBasePath(routerPathname) {
    const storageId = getStorageIdFromPath(routerPathname);
    return `${constants.PATH_SEPARATOR}${NavigationConstants.DATA}${
        constants.PATH_SEPARATOR
    }${storageId}`;
}

/**
 *
 * Handle routing to /data/ds/pathInDataStore
 *
 */
export default function DataStore() {
    const router = useRouter();
    const pathItems = router?.query?.pathItems;
    let path = "";
    if (pathItems && pathItems.length > 0) {
        path = constants.PATH_SEPARATOR + pathItems.join(constants.PATH_SEPARATOR);
    }

    const handlePathChange = (path) => {
        const basePath = getBasePath(router.pathname);
        const encodedPath = getEncodedPath(path);
        router.push(`${basePath}/[...pathItems]`, `${basePath}${encodedPath}`);
    };

    return (
        <Listing
            path={decodeURIComponent(path)}
            handlePathChange={handlePathChange}
            baseId="data"
        />
    );
}
