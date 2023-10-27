/**
 *
 * @author sriram
 *
 * A page to access the DE tools.
 *
 */

import React, { useCallback } from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces } from "i18n";
import constants from "../constants";
import { getLocalStorage } from "components/utils/localStorage";
import Listing from "components/tools/listing/Listing";

import NavigationConstants from "common/NavigationConstants";

export default function Tools() {
    const router = useRouter();
    const query = router.query;
    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage =
        parseInt(query.selectedRowsPerPage) ||
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.TOOLS.PAGE_SIZE)) ||
        100;
    const selectedOrder = query.selectedOrder || constants.SORT_ASCENDING;
    const selectedOrderBy = query.selectedOrderBy || "name";
    const selectedPermFilter = query.selectedPermFilter;
    const selectedSearchTerm = query.selectedSearchTerm || "";

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage, permFilter, searchTerm) => {
            router.push({
                pathname: `/${NavigationConstants.TOOLS}`,
                query: {
                    selectedOrder: order,
                    selectedOrderBy: orderBy,
                    selectedPage: page,
                    selectedRowsPerPage: rowsPerPage,
                    selectedPermFilter: permFilter,
                    selectedSearchTerm: searchTerm,
                },
            });
        },
        [router]
    );

    return (
        <Listing
            baseId="tools"
            page={selectedPage}
            rowsPerPage={selectedRowsPerPage}
            order={selectedOrder}
            orderBy={selectedOrderBy}
            permFilter={selectedPermFilter}
            onRouteToListing={onRouteToListing}
            searchTerm={selectedSearchTerm}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("tools");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "tools",
                ...RequiredNamespaces,
            ])),
        },
    };
}
