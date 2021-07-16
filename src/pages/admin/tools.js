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

import constants from "../../constants";
import { getLocalStorage } from "components/utils/localStorage";
import Listing from "components/tools/listing/Listing";
import RequestListing from "components/tools/requests/Listing";

import { DETabs, DETab, DETabPanel } from "components/utils/DETabs";
import NavigationConstants from "common/NavigationConstants";
import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";

const TABS = {
    listing: "LISTING",
    toolRequests: "TOOL REQUESTS",
};

export default function Tools() {
    const router = useRouter();
    const { t } = useTranslation("tools");
    const query = router.query;
    const selectedToolsPage = parseInt(query.selectedToolsPage) || 0;
    const selectedToolsRowsPerPage =
        parseInt(query.selectedToolsRowsPerPage) ||
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.TOOLS.PAGE_SIZE)) ||
        100;
    const selectedToolsOrder =
        query.selectedToolsOrder || constants.SORT_ASCENDING;
    const selectedToolsOrderBy = query.selectedToolsOrderBy || "name";
    const selectedToolsPermFilter = query.selectedToolsPermFilter;
    const selectedToolsSearchTerm = query.selectedToolsSearchTerm || "";

    const selectedRequestsOrder =
        query.selectedRequestsOrder || constants.SORT_DESCENDING;
    const selectedRequestsOrderBy =
        query.selectedRequestsOrderBy || "date_submitted";

    const profile = useUserProfile()[0];
    const isAdmin = profile?.admin;

    const [selectedTab, setSelectedTab] = React.useState(TABS.listing);

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const onRouteToToolsListing = useCallback(
        (order, orderBy, page, rowsPerPage, permFilter, searchTerm) => {
            router.push({
                pathname: `/${NavigationConstants.ADMIN}/${NavigationConstants.TOOLS}`,
                query: {
                    selectedToolsOrder: order,
                    selectedToolsOrderBy: orderBy,
                    selectedToolsPage: page,
                    selectedToolsRowsPerPage: rowsPerPage,
                    selectedToolsPermFilter: permFilter,
                    selectedToolsSearchTerm: searchTerm,
                },
            });
        },
        [router]
    );

    const onRouteToRequestsListing = useCallback(
        (order, orderBy) => {
            router.push({
                pathname: `/${NavigationConstants.ADMIN}/${NavigationConstants.TOOLS}`,
                query: {
                    selectedRequestsOrder: order,
                    selectedRequestsOrderBy: orderBy,
                },
            });
        },
        [router]
    );

    if (!isAdmin) {
        return <NotAuthorized />;
    } else {
        return (
            <>
                <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                    <DETab
                        value={TABS.listing}
                        label={t("listing")}
                        id="toolListing"
                    />
                    <DETab
                        value={TABS.toolRequests}
                        label={t("toolRequests")}
                        id="toolRequests"
                    />
                </DETabs>
                <DETabPanel
                    tabId="appListing"
                    value={TABS.listing}
                    selectedTab={selectedTab}
                >
                    <Listing
                        baseId="adminTools"
                        page={selectedToolsPage}
                        rowsPerPage={selectedToolsRowsPerPage}
                        order={selectedToolsOrder}
                        orderBy={selectedToolsOrderBy}
                        permFilter={selectedToolsPermFilter}
                        onRouteToListing={onRouteToToolsListing}
                        searchTerm={selectedToolsSearchTerm}
                        isAdmin={isAdmin}
                    />
                </DETabPanel>
                <DETabPanel
                    tabId="toolRequestsListing"
                    value={TABS.toolRequests}
                    selectedTab={selectedTab}
                >
                    <RequestListing
                        baseId="adminToolRequests"
                        order={selectedRequestsOrder}
                        orderBy={selectedRequestsOrderBy}
                        onRouteToRequestsListing={onRouteToRequestsListing}
                    />
                </DETabPanel>
            </>
        );
    }
}

Tools.getInitialProps = async () => ({
    namespacesRequired: ["tools", "common", "util"],
});
