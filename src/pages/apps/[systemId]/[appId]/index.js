/**
 *
 * @author sriram
 *
 *
 */
import React, { useCallback } from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces, useTranslation } from "i18n";

import { getLocalStorage } from "components/utils/localStorage";

import constants from "../../../../constants";
import appFields from "components/apps/appFields";
import { getListingPath } from "components/apps/utils";
import Listing from "components/apps/listing/Listing";

/**
 *
 * Handle routing to individual app by id
 *
 *
 */

export default function App() {
    const router = useRouter();
    const query = router.query;
    const { systemId, appId } = router.query;
    const { t } = useTranslation("apps");
    const appRecordFields = appFields(t);

    const selectedPage = 0;
    const selectedRowsPerPage =
        parseInt(query.selectedRowsPerPage) ||
        parseInt(getLocalStorage(constants.LOCAL_STORAGE.APPS.PAGE_SIZE)) ||
        100;
    const selectedOrder = constants.SORT_ASCENDING;
    const selectedOrderBy = appRecordFields.NAME.key;

    const selectedFilter = null;
    const selectedCategory = null;

    const onRouteToListing = useCallback(
        (order, orderBy, page, rowsPerPage, filter, category) => {
            router.push(
                getListingPath(
                    order,
                    orderBy,
                    page,
                    rowsPerPage,
                    filter,
                    category
                )
            );
        },
        [router]
    );
    return (
        <Listing
            baseId="apps"
            selectedSystemId={systemId}
            selectedAppId={appId}
            onRouteToListing={onRouteToListing}
            page={selectedPage}
            rowsPerPage={selectedRowsPerPage}
            order={selectedOrder}
            orderBy={selectedOrderBy}
            filter={selectedFilter}
            category={selectedCategory}
            isAdminView={false}
        />
    );
}

export async function getServerSideProps({ locale }) {
    const title = i18n.t("apps");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "collections",
                // "apps" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}
