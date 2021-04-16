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
import NotAuthorized from "components/utils/error/NotAuthorized";
import { DETabPanel } from "components/utils/DETabs";
import AppPublicationRequests from "components/apps/admin/publicationRequests/RequestListing";

import { Tab, Tabs, makeStyles } from "@material-ui/core";

const TABS = {
    listing: "LISTING",
    pubRequest: "PUBLICATION REQUESTS",
};

const useStyles = makeStyles((theme) => ({
    tabAppBarColorPrimary: {
        backgroundColor: theme.palette.white,
    },
    tabRoot: {
        color: theme.palette.darkGray,
        "&:hover": {
            color: theme.palette.black,
        },
    },
    tabSelected: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    tabPanelRoot: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

export default function Apps() {
    const classes = useStyles();
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
        (order, orderBy, page, rowsPerPage, filter, category) => {
            router.push(
                getListingPath(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    filter,
                    category,
                    isAdmin
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
                <Tabs
                    value={selectedTab}
                    onChange={onTabSelectionChange}
                    classes={{ indicator: classes.tabIndicator }}
                >
                    <Tab
                        value={TABS.listing}
                        label={t("listing")}
                        id="appListing"
                        classes={{ selected: classes.tabSelected }}
                    />
                    <Tab
                        value={TABS.pubRequest}
                        label={t("pubRequests")}
                        id="appPubRequests"
                        classes={{ selected: classes.tabSelected }}
                    />
                </Tabs>
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
                    />
                </DETabPanel>
                <DETabPanel
                    tabId="pubRequestListing"
                    value={TABS.pubRequest}
                    selectedTab={selectedTab}
                >
                    <AppPublicationRequests />
                </DETabPanel>
            </>
        );
    }
}
Apps.getInitialProps = async () => ({
    namespacesRequired: ["apps", "tools", "common", "util"],
});
