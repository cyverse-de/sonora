/**
 *
 * Display tablular view of detailed apps search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useTranslation } from "i18n";

import SearchError from "./SearchError";
import SearchResultsTable from "./SearchResultsTable";
import searchConstants from "../constants";
import constants from "../../../constants";
import TableLoading from "../../utils/TableLoading";
import {
    searchAppsInfiniteQuery,
    APPS_SEARCH_QUERY_KEY,
} from "serviceFacades/apps";
import appFields from "../../apps/appFields";

import { Typography } from "@material-ui/core";

export default function AppSearchResults(props) {
    const { searchTerm, updateResultCount, baseId } = props;
    const [appsSearchKey, setAppsSearchKey] = useState(APPS_SEARCH_QUERY_KEY);
    const [appsSearchQueryEnabled, setAppsSearchQueryEnabled] = useState(false);

    const { t } = useTranslation(["search"]);
    //TODO: pass `t` into this function
    const appRecordFields = appFields();
    const [order, setOrder] = useState(constants.SORT_ASCENDING);
    const [orderBy, setOrderBy] = useState(appRecordFields.NAME.key);
    const {
        status,
        data,
        isFetchingMore,
        fetchMore,
        canFetchMore,
        error,
    } = useInfiniteQuery(appsSearchKey, searchAppsInfiniteQuery, {
        enabled: appsSearchQueryEnabled,
        getFetchMore: (lastGroup, allGroups) => {
            const totalPage = Math.ceil(lastGroup?.total / searchConstants.DETAILED_SEARCH_PAGE_SIZE);
            if (allGroups.length < totalPage) {
                return allGroups.length;
            } else {
                return false;
            }
        },
    });

    const loadMoreButtonRef = React.useRef();

    useEffect(() => {
        if (searchTerm && searchTerm.length > 2) {
            setAppsSearchKey([
                APPS_SEARCH_QUERY_KEY,
                {
                    rowsPerPage: searchConstants.DETAILED_SEARCH_PAGE_SIZE,
                    orderBy: orderBy,
                    order: order,
                    search: searchTerm,
                },
            ]);
            setAppsSearchQueryEnabled(true);
        } else {
            setAppsSearchQueryEnabled(false);
        }
    }, [appRecordFields.NAME.key, order, orderBy, searchTerm]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: appRecordFields.NAME.key,
            },
            {
                Header: "Integrator",
                accessor: appRecordFields.INTEGRATOR.key,
            },
            {
                Header: "System",
                accessor: appRecordFields.SYSTEM.key,
            },
        ],
        [
            appRecordFields.INTEGRATOR.key,
            appRecordFields.NAME.key,
            appRecordFields.SYSTEM.key,
        ]
    );
    if (status === "loading") {
        return <TableLoading numColumns={5} numRows={100} baseId={baseId} />;
    }
    if (error) {
        return <SearchError error={error} baseId={baseId} />;
    }
    if (!data || data.length === 0 || data[0].apps.length === 0) {
        return <Typography>{t("noResults")}</Typography>;
    }

    let flatdata = [];
    data.forEach((page) => {
        flatdata = [...flatdata, ...page.apps];
    });

    if (status === "success") {
        updateResultCount(data[0].total);
    }

    return (
        <SearchResultsTable
            columns={columns}
            data={flatdata}
            baseId={baseId}
            fetchMore={fetchMore}
            ref={loadMoreButtonRef}
            isFetchingMore={isFetchingMore}
            canFetchMore={canFetchMore}
            initialSortBy={[{ id: orderBy, desc: order === constants.SORT_DESCENDING }]}
            onSort={(colId, descending) => {
                setOrderBy(colId);
                descending
                    ? setOrder(constants.SORT_DESCENDING)
                    : setOrder(constants.SORT_ASCENDING);
            }}
        />
    );
}
