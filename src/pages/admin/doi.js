/**
 *
 * @author sriram
 *
 * A page for the DE Admin to access DOI requests.
 *
 */

import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, RequiredNamespaces } from "i18n";
import Listing from "components/doi/Listing";
import NotAuthorized from "components/error/NotAuthorized";
import { useUserProfile } from "contexts/userProfile";
import constants from "../../constants";
import NavigationConstants from "common/NavigationConstants";
import { NavigationParams } from "common/NavigationConstants";

export default function Doi() {
    const router = useRouter();
    const query = router.query;

    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage = parseInt(query.selectedRowsPerPage) || 25;
    const selectedOrder = query.selectedOrder || constants.SORT_DESCENDING;
    const selectedOrderBy = query.selectedOrderBy || "date_submitted";

    const profile = useUserProfile()[0];

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage) => {
            router.push({
                pathname: `/${NavigationConstants.ADMIN}/${NavigationConstants.DOI}`,
                query: {
                    selectedOrder: order,
                    selectedOrderBy: orderBy,
                    selectedPage: page,
                    selectedRowsPerPage: rowsPerPage,
                },
            });
        },
        [router]
    );

    const onRouteToMetadataView = useCallback(
        (path) => {
            router.push({
                pathname: `/${NavigationConstants.DATA}/${constants.DATA_STORE_STORAGE_ID}${path}`,
                query: {
                    view: NavigationParams.VIEW.METADATA,
                },
            });
        },
        [router]
    );

    if (!profile?.admin) {
        return <NotAuthorized />;
    }

    return (
        <Listing
            baseId="adminDOIReqListing"
            page={selectedPage}
            rowsPerPage={selectedRowsPerPage}
            order={selectedOrder}
            orderBy={selectedOrderBy}
            onRouteToListing={onRouteToListing}
            onRouteToMetadataView={onRouteToMetadataView}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("doiRequests");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "doi",
                "data",
                ...RequiredNamespaces,
            ])),
        },
    };
}
