/**
 *
 * @author sriram
 *
 * A page to access the DE admin apps.
 *
 */

import React, { useCallback } from "react";

import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import { getLocalStorage } from "components/utils/localStorage";

import constants from "../../constants";
import appFields from "components/apps/appFields";
import { getListingPath } from "components/apps/utils";
import Listing from "components/apps/listing/Listing";
import { useUserProfile } from "contexts/userProfile";
import { DETabs, DETab, DETabPanel } from "components/utils/DETabs";
import NotAuthorized from "components/error/NotAuthorized";
import AppPublicationRequests from "components/apps/admin/publicationRequests/RequestListing";
import { getOwnershipFilters } from "components/apps/toolbar/Toolbar";

const TABS = {
    listing: "LISTING",
    pubRequest: "PUBLICATION REQUESTS",
};

export default function Apps() {
    const router = useRouter();
    const query = router.query;
    const { t } = useTranslation("apps");
    const profile = useUserProfile()[0];
    const isAdmin = profile?.admin;

    const [selectedTab, setSelectedTab] = React.useState(TABS.listing);

    const appRecordFields = appFields(t);
    const selectedPage = parseInt(query.selectedPage) || 0;
    const selectedRowsPerPage =
        parseInt(query.selectedRowsPerPage) ||
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.APPS.PAGE_SIZE)) ||
        100;
    const selectedOrder = query.selectedOrder || constants.SORT_ASCENDING;
    const selectedOrderBy = query.selectedOrderBy || appRecordFields.NAME.key;
    const searchTerm = query.searchTerm || "";
    const adminOwnershipFilter = query.adminOwnershipFilter
        ? JSON.parse(query.adminOwnershipFilter)
        : getOwnershipFilters(t)[0];

    const selectedFilter = query.selectedFilter
        ? JSON.parse(query.selectedFilter)
        : null;

    const selectedCategory = query.selectedCategory
        ? JSON.parse(query.selectedCategory)
        : {
              name: constants.BROWSE_ALL_APPS,
              id: constants.BROWSE_ALL_APPS_ID,
          };

    const onRouteToListing = useCallback(
        (
            order,
            orderBy,
            page,
            rowsPerPage,
            filter,
            category,
            searchTerm,
            adminOwnershipFilter
        ) => {
            router.push(
                getListingPath(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    filter,
                    category,
                    isAdmin,
                    searchTerm,
                    adminOwnershipFilter
                )
            );
        },
        [isAdmin, router]
    );

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    if (!isAdmin) {
        return <NotAuthorized />;
    } else {
        return (
            <>
                <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                    <DETab
                        value={TABS.listing}
                        label={t("listing")}
                        id="appListing"
                    />
                    <DETab
                        value={TABS.pubRequest}
                        label={t("pubRequests")}
                        id="appPubRequests"
                    />
                </DETabs>
                <DETabPanel
                    tabId="appListing"
                    value={TABS.listing}
                    selectedTab={selectedTab}
                >
                    <Listing
                        baseId="apps"
                        onRouteToListing={onRouteToListing}
                        page={selectedPage}
                        rowsPerPage={selectedRowsPerPage}
                        order={selectedOrder}
                        orderBy={selectedOrderBy}
                        filter={selectedFilter}
                        category={selectedCategory}
                        isAdminView={isAdmin}
                        searchTerm={searchTerm}
                        adminOwnershipFilter={adminOwnershipFilter}
                        appBarHeight={290}
                    />
                </DETabPanel>
                <DETabPanel
                    tabId="pubRequestListing"
                    value={TABS.pubRequest}
                    selectedTab={selectedTab}
                >
                    <AppPublicationRequests parentId={"pubRequestListing"} />
                </DETabPanel>
            </>
        );
    }
}
Apps.getInitialProps = async () => ({
    namespacesRequired: ["apps", "tools", "common", "util"],
});
