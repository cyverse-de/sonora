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
    const { t } = useTranslation([" search"]);
    //TODO: pass `t` into this function
    const appRecordFields = appFields();
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
            const totalPage = Math.ceil(lastGroup?.total / 100);
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
                    orderBy: appRecordFields.NAME.key,
                    order: constants.SORT_ASCENDING,
                    search: searchTerm,
                },
            ]);
            setAppsSearchQueryEnabled(true);
        } else {
            setAppsSearchQueryEnabled(false);
        }
    }, [appRecordFields.NAME.key, searchTerm]);

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
        return <Typography> {t("errorAppsSearch")} </Typography>;
    }
    if (!data) {
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
        />
    );
}
