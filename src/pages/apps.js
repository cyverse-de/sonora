/**
 *
 * @author sriram
 *
 * A page to access the DE apps.
 *
 */

import React, { useCallback } from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { i18n, RequiredNamespaces, useTranslation } from "i18n";

import { getLocalStorage } from "components/utils/localStorage";

import constants from "../constants";
import appFields from "components/apps/appFields";
import { getListingPath } from "components/apps/utils";
import Listing from "components/apps/listing/Listing";
import systemId from "components/models/systemId";

export default function Apps() {
    const router = useRouter();
    const query = router.query;
    const { t } = useTranslation("apps");

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
              system_id: systemId.de,
              name: constants.FEATURED_APPS,
              id: constants.FEATURED_APPS_ID,
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
                    category
                )
            );
        },
        [router]
    );
    return (
        <Listing
            baseId="apps"
            onRouteToListing={onRouteToListing}
            page={selectedPage}
            rowsPerPage={selectedRowsPerPage}
            order={selectedOrder}
            orderBy={selectedOrderBy}
            filter={selectedFilter}
            category={selectedCategory}
            isAdminView={false}
            searchTerm=""
        />
    );
}

export async function getServerSideProps(context) {
    const { locale, query } = context;

    let selectedCategory;
    if (query.selectedCategory) {
        selectedCategory = JSON.parse(query.selectedCategory).name;
    }

    const title = selectedCategory || i18n.t("apps");

    return {
        props: {
            title,
            ...(await serverSideTranslations(locale, [
                "data",
                "collections",
                // "apps" already included by RequiredNamespaces
                ...RequiredNamespaces,
            ])),
        },
    };
}
