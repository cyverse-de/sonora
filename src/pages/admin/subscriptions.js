/**
 *
 * @author sboleyn
 *
 * A page to access the admin subscription interface.
 *
 */

import React, { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces, useTranslation } from "i18n";

import Listing from "components/subscriptions/listing/Listing";
import AddOnsListing from "components/subscriptions/addons/listing/Listing";
import { DETabs, DETab, DETabPanel } from "components/utils/DETabs";
import NotAuthorized from "components/error/NotAuthorized";
import { getLocalStorage } from "components/utils/localStorage";

import NavigationConstants from "common/NavigationConstants";
import { useUserProfile } from "contexts/userProfile";
import constants from "../../constants";
import ids from "components/subscriptions/ids";

import {
    getAvailableAddOns,
    AVAILABLE_ADDONS_QUERY_KEY,
} from "serviceFacades/subscriptions";

const TABS = {
    listing: "LISTING",
    addons: "ADD-ONS",
};

export default function Subscriptions() {
    const router = useRouter();
    const query = router.query;
    const { t } = useTranslation("subscriptions");
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
    const [selectedTab, setSelectedTab] = useState(TABS.listing);
    const onTabSelectionChange = (_event, selectedTab) => {
        setSelectedTab(selectedTab);
    };
    const [availableAddons, setAvailableAddons] = useState(null);
    const [getAddonsQueryEnabled, setGetAddonsQueryEnabled] = useState(false);
    const queryClient = useQueryClient();
    const availableAddonsCache = queryClient.getQueryData(
        AVAILABLE_ADDONS_QUERY_KEY
    );

    const preProcessAvailableAddons = React.useCallback(
        (data) => {
            if (data?.addons?.length > 0) {
                setAvailableAddons(data);
            }
        },
        [setAvailableAddons]
    );

    React.useEffect(() => {
        if (!!availableAddonsCache) {
            preProcessAvailableAddons(availableAddonsCache);
        } else {
            setGetAddonsQueryEnabled(true);
        }
    }, [preProcessAvailableAddons, availableAddonsCache]);

    const { isFetchingAvailableAddons, errorFetchingAvailableAddons } =
        useQuery({
            queryKey: [AVAILABLE_ADDONS_QUERY_KEY],
            queryFn: getAvailableAddOns,
            enabled: getAddonsQueryEnabled,
            staleTime: Infinity,
            cacheTime: Infinity,
            onSuccess: preProcessAvailableAddons,
        });

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
            <>
                <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                    <DETab
                        value={TABS.listing}
                        label={t("listing")}
                        id={ids.SUBSCRIPTION_LISTING_TAB}
                    />
                    <DETab
                        value={TABS.addons}
                        label={t("addons")}
                        id={ids.ADDONS.LISTING_TAB}
                    />
                </DETabs>
                <DETabPanel
                    tabId={ids.SUBSCRIPTION_LISTING}
                    value={TABS.listing}
                    selectedTab={selectedTab}
                >
                    <Listing
                        availableAddons={availableAddons}
                        baseId="subscription"
                        isAdminView={isAdmin}
                        onRouteToListing={onRouteToListing}
                        order={selectedOrder}
                        orderBy={selectedOrderBy}
                        page={selectedPage}
                        rowsPerPage={selectedRowsPerPage}
                        searchTerm={searchTerm}
                    />
                </DETabPanel>
                <DETabPanel
                    tabId={ids.ADDONS.LISTING}
                    value={TABS.addons}
                    selectedTab={selectedTab}
                >
                    <AddOnsListing
                        availableAddons={availableAddons}
                        isFetchingAvailableAddons={isFetchingAvailableAddons}
                        errorFetchingAvailableAddons={
                            errorFetchingAvailableAddons
                        }
                        baseId="addons"
                        isAdminView={isAdmin}
                    />
                </DETabPanel>
            </>
        );
    }
}

export async function getServerSideProps(context) {
    const {
        locale,
        query: { searchTerm },
    } = context;

    let title = i18n.t("subscriptions");
    if (searchTerm) {
        title = i18n.t("subscriptions:pageTitle", { searchTerm });
    }

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "subscriptions",
                ...RequiredNamespaces,
            ])),
        },
    };
}
