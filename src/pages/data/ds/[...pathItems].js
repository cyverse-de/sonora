/**
 * @author sriram
 *
 */

import React from "react";
import { useRouter } from "next/router";
import Listing from "../../../components/data/listing/Listing";
import constants from "../../../constants";
import NavigationConstants from "../../../components/layout/NavigationConstants";

/**
 *
 * Handle routing to /data/ds/*
 *
 */
export default function DataStore() {
    const router = useRouter();
    const pathItems = router?.query.pathItems;
    let path = constants.PATH_SEPARATOR;
    if (pathItems && pathItems.length > 0) {
        path = path + pathItems.join(constants.PATH_SEPARATOR);
    }

    const handlePathChange = (path) => {
        const storageId = router.pathname.split(constants.PATH_SEPARATOR)[2];
        router.push(
            constants.PATH_SEPARATOR +
                NavigationConstants.DATA +
                constants.PATH_SEPARATOR +
                `${storageId}${path}`
        );
    };

    return (
        <Listing
            path={path}
            handlePathChange={handlePathChange}
            baseId="data"
        />
    );
}
