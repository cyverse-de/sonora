/**
 *
 * @author sriram
 *
 *
 */
import React, { useCallback } from "react";
import { useRouter } from "next/router";

import constants from "../../../../constants";
import AppFields from "components/apps/AppFields";
import { getAppLaunchPath, getListingPath } from "components/apps/utils";
import Listing from "components/apps/listing/Listing";

/**
 *
 * Handle routing to individual app by id
 *
 *
 */

export default function App() {
    const router = useRouter();
    const { systemId, appId } = router.query;

    const selectedPage = 0;
    const selectedRowsPerPage = 25;
    const selectedOrder = constants.SORT_ASCENDING;
    const selectedOrderBy = AppFields.NAME.key;

    const selectedFilter = null;
    const selectedCategory = null;

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage, filter, category) => {
            router.push(
                getListingPath(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    filter,
                    category
                )
            );
        },
        [router]
    );
    return (
        <Listing
            baseId="apps"
            selectedSystemId={systemId}
            selectedAppId={appId}
            onRouteToApp={(systemId, appId) =>
                router.push(getAppLaunchPath(systemId, appId))
            }
            onRouteToListing={onRouteToListing}
            selectedPage={selectedPage}
            selectedRowsPerPage={selectedRowsPerPage}
            selectedOrder={selectedOrder}
            selectedOrderBy={selectedOrderBy}
            selectedFilter={selectedFilter}
            selectedCategory={selectedCategory}
        />
    );
}
