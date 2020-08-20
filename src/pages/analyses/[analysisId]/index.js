/**
 *
 * @author sriram
 *
 *
 */
import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import constants from "../../../constants";

import { getListingPath } from "components/analyses/utils";
import analysisFields from "components/analyses/analysisFields";
import Listing from "components/analyses/listing/Listing";

/**
 *
 * Handle routing an indvidual analysis by id
 *
 */

export default function Analysis() {
    const router = useRouter();
    const { t } = useTranslation("analyses");
    const analysisRecordFields = analysisFields(t);
    const selectedPage = 0;
    const selectedRowsPerPage = 25;
    const selectedOrder = constants.SORT_DESCENDING;
    const selectedOrderBy = analysisRecordFields.START_DATE.key;
    const selectedPermFilter = null;
    const selectedTypeFilter = null;

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
            selectedIdFilter={router.query?.analysisId}
            selectedPage={selectedPage}
            selectedRowsPerPage={selectedRowsPerPage}
            selectedOrder={selectedOrder}
            selectedOrderBy={selectedOrderBy}
            selectedPermFilter={selectedPermFilter}
            selectedTypeFilter={selectedTypeFilter}
        />
    );
}

Analysis.getInitialProps = async () => ({
    namespacesRequired: ["analyses"],
});
