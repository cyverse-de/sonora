/**
 *
 * @author sriram
 */
import React from "react";
import { useRouter } from "next/router";
import Listing from "../../components/data/listing/Listing";
import NavigationConstants from "../../common/NavigationConstants";
import constants from "../../constants";
import {
    getEncodedPath,
    getStorageIdFromPath,
} from "../../components/data/utils";

/**
 * compute routing path from selected storage and path
 *
 * @param {string} routerPathname - pathname returned by the nextjs router object
 * @param {string} selectedPath - user selected path
 * @returns {string} - routing path to be used by the nextjs router
 */
function getRoutingPath(routerPathname, selectedPath) {
    const storageId = getStorageIdFromPath(routerPathname);
    return `${constants.PATH_SEPARATOR}${NavigationConstants.DATA}${
        constants.PATH_SEPARATOR
    }${storageId}${getEncodedPath(selectedPath)}`;
}

/**
 *
 * Handle default routing to /data
 *
 */
export default function Data() {
    const router = useRouter();
    const handlePathChange = (path) => {
        router.push(getRoutingPath(router.pathname, path));
    };

    return (
        <Listing path="" handlePathChange={handlePathChange} baseId="data" />
    );
}

export { getRoutingPath };
