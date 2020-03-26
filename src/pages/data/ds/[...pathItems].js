/**
 * @author sriram
 *
 */

import React from "react";
import { useRouter } from "next/router";
import Listing from "../../../components/data/listing/Listing";
import constants from "../../../constants";
import { getRoutingPath } from "../index";

/**
 *
 * Handle routing to /data/ds/*
 *
 */
export default function DataStore() {
    const router = useRouter();
    const pathItems = router?.query?.pathItems;
    let path = constants.PATH_SEPARATOR;
    if (pathItems && pathItems.length > 0) {
        path = path + pathItems.join(constants.PATH_SEPARATOR);
    }

    const handlePathChange = (path) => {
        router.push(getRoutingPath(router.pathname, path));
    };

    return (
        <Listing
            path={decodeURIComponent(path)}
            handlePathChange={handlePathChange}
            baseId="data"
        />
    );
}
