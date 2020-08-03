/**
 * @author sriram
 *
 * Analyses listing page
 *
 */

import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import constants from "../constants";

import {
    getAnalysisRelaunchPage,
    getListingPath,
} from "components/analyses/utils";
import { getFolderPage } from "components/data/utils";
import Listing from "components/analyses/listing/Listing";
import { getOwnershipFilters } from "components/analyses/toolbar/Toolbar";

export default function Analyses() {
    const router = useRouter();
    const query = router.query;
    const { t } = useTranslation("analyses");

    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage = parseInt(query.selectedRowsPerPage) || 25;
    const selectedOrder = query.selectedOrder || constants.SORT_DESCENDING;
    const selectedOrderBy = query.selecetdOrderBy || "startdate";

    console.log("filter=> " + JSON.stringify(getOwnershipFilters(t)[0]));
    console.log("selected perm filter=>" + query.selectedPermFilter);

    const selectedPermFilter = query.selectedPermFilter
        ? JSON.parse(query.selectedPermFilter)
        : null;
    const selectedTypeFilter = query.selectedTypeFilter
        ? JSON.parse(query.selectedTypeFilter)
        : null;

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage, permFilter, appTypeFilter) => {
            router.push(
                getListingPath(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    permFilter,
                    appTypeFilter
                )
            );
        },
        [router]
    );

    return (
        <Listing
            baseId="analyses"
            onRouteToListing={onRouteToListing}
            selectedPage={selectedPage}
            selectedRowsPerPage={selectedRowsPerPage}
            selectedOrder={selectedOrder}
            selectedOrderBy={selectedOrderBy}
            selectedPermFilter={selectedPermFilter}
            selectedTypeFilter={selectedTypeFilter}
            handleGoToOutputFolder={(analysis) => {
                if (analysis?.resultfolderid) {
                    router.push(getFolderPage(analysis.resultfolderid));
                }
            }}
            handleSingleRelaunch={(analysis) => {
                if (analysis?.id) {
                    router.push(getAnalysisRelaunchPage(analysis.id));
                }
            }}
        />
    );
}

Analyses.getInitialProps = async () => ({
    namespacesRequired: ["analyses"],
});
