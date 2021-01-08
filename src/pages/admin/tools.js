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
import NotAuthorized from "components/utils/NotAuthorized";

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

    console.log("is it admin user=>" + profile?.admin);

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage, permFilter, searchTerm) => {
            const base = isAdmin
                ? `/${NavigationConstants.ADMIN}/${NavigationConstants.TOOLS}`
                : `/${NavigationConstants.TOOLS}`;
            router.push(
                `${base}?selectedOrder=${order}&selectedOrderBy=${orderBy}&selectedPage=${page}&selectedRowsPerPage=${rowsPerPage}&selectedPermFilter=${permFilter}&selectedSearchTerm=${searchTerm}`
            );
        },
        [isAdmin, router]
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
