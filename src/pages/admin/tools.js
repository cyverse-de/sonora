/**
 *
 * @author sriram
 *
 * A page to access the DE tools.
 *
 */

import React, { useCallback } from "react";
import { useRouter } from "next/router";

import constants from "../../constants";
import { getLocalStorage } from "components/utils/localStorage";
import Listing from "components/tools/listing/Listing";

import NavigationConstants from "common/NavigationConstants";
import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/utils/error/NotAuthorized";

export default function Tools() {
    const router = useRouter();
    const query = router.query;
    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage =
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.TOOLS.PAGE_SIZE)) ||
        100;
    const selectedOrder = query.selectedOrder || constants.SORT_ASCENDING;
    const selectedOrderBy = query.selectedOrderBy || "name";
    const selectedPermFilter = query.selectedPermFilter;
    const selectedSearchTerm = query.selectedSearchTerm || "";
    const profile = useUserProfile()[0];
    const isAdmin = profile?.admin;

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage, permFilter, searchTerm) => {
            router.push({
                pathname: `/${NavigationConstants.ADMIN}/${NavigationConstants.TOOLS}`,
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

    if (!isAdmin) {
        return <NotAuthorized />;
    } else {
        return (
            <Listing
                baseId="tools"
                selectedPage={selectedPage}
                selectedRowsPerPage={selectedRowsPerPage}
                selectedOrder={selectedOrder}
                selectedOrderBy={selectedOrderBy}
                selectedPermFilter={selectedPermFilter}
                onRouteToListing={onRouteToListing}
                selectedSearchTerm={selectedSearchTerm}
                isAdmin={isAdmin}
            />
        );
    }
}

Tools.getInitialProps = async () => ({
    namespacesRequired: ["tools", "common", "util"],
});
