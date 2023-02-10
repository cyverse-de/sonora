/**
 *
 * @author sboleyn
 *
 * A page to access the admin subscription interface.
 *
 */

import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations, RequiredNamespaces } from "i18n";
import Listing from "components/subscriptions/listing/Listing";

import NavigationConstants from "common/NavigationConstants";
import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";
import constants from "../../constants";
import { getLocalStorage } from "components/utils/localStorage";

export default function Subscriptions() {
    const router = useRouter();
    const query = router.query;
    const searchTerm = query.searchTerm || "";
    const selectedOrder = query.selectedOrder || constants.SORT_ASCENDING;
    const selectedOrderBy = query.selectedOrderBy || "username";
    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage =
        parseInt(query.selectedRowsPerPage) ||
        parseInt(
            getLocalStorage(constants.LOCAL_STORAGE.SUBSCRIPTIONS.PAGE_SIZE)
        ) ||
        100;

    const profile = useUserProfile()[0];
    const isAdmin = profile?.admin;

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage, searchTerm) => {
            router.push({
                pathname: `/${NavigationConstants.ADMIN}/${NavigationConstants.SUBSCRIPTIONS}`,
                query: {
                    selectedOrder: order,
                    selectedOrderBy: orderBy,
                    selectedPage: page,
                    selectedRowsPerPage: rowsPerPage,
                    searchTerm: searchTerm,
                },
            });
        },
        [router]
    );
    if (!isAdmin) {
        return <NotAuthorized />;
    } else {
        return (
            <Listing
                baseId="subscription"
                isAdminView={isAdmin}
                onRouteToListing={onRouteToListing}
                order={selectedOrder}
                orderBy={selectedOrderBy}
                page={selectedPage}
                rowsPerPage={selectedRowsPerPage}
                searchTerm={searchTerm}
            />
        );
    }
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "subscriptions",
                ...RequiredNamespaces,
            ])),
        },
    };
}
