/**
 * @author sriram
 * 
 * Analyses listing page
 * 
 */

import React, {useCallback} from "react";

import { useRouter } from "next/router";

import constants from "../constants";

import { getAnalysisRelaunchPage, getListingPath } from "components/analyses/utils";
import { getFolderPage } from "components/data/utils";
import Listing from "components/analyses/listing/Listing";

export default function Analyses() {
    const router = useRouter();
    const query = router.query;

    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage = parseInt(query.selectedRowsPerPage) || 25;
    const selectedOrder = query.selectedOrder || constants.SORT_DESCENDING;
    const selectedOrderBy = query.selecetdOrderBy || "startdate";

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage) => {
            router.push(
                getListingPath(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
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
