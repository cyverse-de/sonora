/**
 *
 * @author sriram
 *
 * A page to access the DE apps.
 *
 */

import React, { useCallback } from "react";

import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import constants from "../constants";
import appFields from "components/apps/appFields";
import { getAppLaunchPath, getListingPath } from "../components/apps/utils";
import Listing from "../components/apps/listing/Listing";

export default function Apps() {
    const router = useRouter();
    const query = router.query;
    const { t } = useTranslation("apps");
    const appRecordFields = appFields(t);
    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage = parseInt(query.selectedRowsPerPage) || 25;
    const selectedOrder = query.selectedOrder || constants.SORT_ASCENDING;
    const selectedOrderBy = query.selectedOrderBy || appRecordFields.NAME.key;

    const selectedFilter = query.selectedFilter
        ? JSON.parse(query.selectedFilter)
        : null;

    const selectedCategory = query.selectedCategory
        ? JSON.parse(query.selectedCategory)
        : {
              name: constants.BROWSE_ALL_APPS,
              id: constants.BROWSE_ALL_APPS_ID,
          };

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
