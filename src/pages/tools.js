/**
 *
 * @author sriram
 *
 * A page to access the DE tools.
 *
 */

import React, { useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import constants from "../constants";
import { getLocalStorage } from "components/utils/localStorage";
import Listing from "components/tools/listing/Listing";

import NavigationConstants from "common/NavigationConstants";

export default function Tools() {
    const router = useRouter();
    const query = router.query;
    const { t } = useTranslation("tools");
    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage =
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.ANALYSES.PAGE_SIZE)) ||
        100;
    const selectedOrder = query.selectedOrder || constants.SORT_ASCENDING;
    const selectedOrderBy = query.selectedOrderBy || "name";

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage) => {
            router.push(
                `/${NavigationConstants.TOOLS}?selectedOrder=${order}&selectedOrderBy=${orderBy}&selectedPage=${page}&selectedRowsPerPage=${rowsPerPage}`
            );
        },
        [router]
    );

    return (
        <Listing
            baseId="tools"
            selectedPage={selectedPage}
            selectedRowsPerPage={selectedRowsPerPage}
            selectedOrder={selectedOrder}
            selectedOrderBy={selectedOrderBy}
            onRouteToListing={onRouteToListing}
        />
    );
}

Tools.getInitialProps = async () => ({
    namespacesRequired: ["tools", "common", "util"],
});
