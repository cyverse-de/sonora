/**
 * @author sriram
 *
 * Analyses listing page
 *
 */

import React, { useCallback } from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RequiredNamespaces, useTranslation } from "i18n";

import constants from "../constants";

import { getLocalStorage } from "components/utils/localStorage";
import { getListingPath } from "components/analyses/utils";
import analysisFields from "components/analyses/analysisFields";
import Listing from "components/analyses/listing/Listing";
import { getOwnershipFilters } from "components/analyses/toolbar/Toolbar";

export default function Analyses() {
    const router = useRouter();
    const query = router.query;
    const { t } = useTranslation("analyses");
    const analysisRecordFields = analysisFields(t);
    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage =
        parseInt(query.selectedRowsPerPage) ||
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.ANALYSES.PAGE_SIZE)) ||
        100;
    const selectedOrder = query.selectedOrder || constants.SORT_DESCENDING;
    const selectedOrderBy =
        query.selectedOrderBy || analysisRecordFields.START_DATE.key;

    const selectedPermFilter = query.selectedPermFilter
        ? JSON.parse(query.selectedPermFilter)
        : getOwnershipFilters(t)[0];
    const selectedTypeFilter = query.selectedTypeFilter
        ? JSON.parse(query.selectedTypeFilter)
        : null;

    const selectedIdFilter = query.selectedIdFilter
        ? JSON.parse(query.selectedIdFilter)
        : null;

    const onRouteToListing = useCallback(
        (
            order,
            orderBy,
            page,
            rowsPerPage,
            permFilter,
            appTypeFilter,
            idFilter
        ) => {
            router.push(
                getListingPath(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    JSON.stringify(permFilter),
                    JSON.stringify(appTypeFilter),
                    JSON.stringify(idFilter)
                )
            );
        },
        [router]
    );

    return (
        <Listing
            baseId="analyses"
            onRouteToListing={onRouteToListing}
            idFilter={selectedIdFilter}
            page={selectedPage}
            rowsPerPage={selectedRowsPerPage}
            order={selectedOrder}
            orderBy={selectedOrderBy}
            permFilter={selectedPermFilter}
            typeFilter={selectedTypeFilter}
        />
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "data",
                // "analyses" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}
