/**
 *
 * Display tabular view of detailed apps search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import Link from "next/link";

import NameLink from "./NameLink";

import SearchError from "./SearchError";
import SearchResultsTable from "./SearchResultsTable";
import { useAppsSearchInfinite } from "../searchQueries";
import searchConstants from "../constants";
import constants from "../../../constants";

import { APPS_SEARCH_QUERY_KEY } from "serviceFacades/apps";
import appFields from "components/apps/appFields";
import NavigationConstants from "common/NavigationConstants";

import { IconButton, Typography } from "@material-ui/core";
import { Info } from "@material-ui/icons";

function Name(props) {
    const { selectedOption, searchTerm } = props;

    const href = `/${NavigationConstants.APPS}/[systemId]/[appId]/launch`;
    const as = `/${NavigationConstants.APPS}/${selectedOption?.system_id}/${selectedOption?.id}/launch`;

    return (
        <Link href={href} as={as} passHref>
            <NameLink name={selectedOption?.name} searchTerm={searchTerm} />
        </Link>
    );
}

export default function AppSearchResults(props) {
    const { searchTerm, updateResultCount, baseId } = props;
    const [appsSearchKey, setAppsSearchKey] = useState(APPS_SEARCH_QUERY_KEY);
    const [appsSearchQueryEnabled, setAppsSearchQueryEnabled] = useState(false);
    const [detailsResource, setDetailsResource] = useState(null);
    const { t } = useTranslation(["search"]);
    //SS TODO: pass `t` into this function
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
    } = useAppsSearchInfinite(
        appsSearchKey,
        appsSearchQueryEnabled,
        (lastGroup, allGroups) => {
            const totalPages = Math.ceil(
                lastGroup?.total / searchConstants.DETAILED_SEARCH_PAGE_SIZE
            );
            if (allGroups.length < totalPages) {
                return allGroups.length;
            } else {
                return false;
            }
        }
    );

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
    }, [order, orderBy, searchTerm, setAppsSearchQueryEnabled]);

    useEffect(() => {
        if (data && data.length > 0) {
            updateResultCount(data[0].total);
        }
    }, [data, updateResultCount]);

    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                accessor: appRecordFields.NAME.key,
                Cell: ({ row }) => (
                    <Name
                        selectedOption={row?.original}
                        searchTerm={searchTerm}
                    />
                ),
            },
            {
                Header: "Integrator",
                accessor: appRecordFields.INTEGRATOR.key,
            },
            {
                Header: "System",
                accessor: appRecordFields.SYSTEM.key,
            },
            {
                Header: "",
                accessor: "actions",
                Cell: ({ row }) => {
                    const original = row?.original;
                    return (
                        <IconButton
                            onClick={() => setDetailsResource(original)}
                            fontSize="small"
                            color="primary"
                        >
                            <Info fontSize="small" />
                        </IconButton>
                    );
                },
                disableSortBy: true,
            },
        ],
        [
            appRecordFields.INTEGRATOR.key,
            appRecordFields.NAME.key,
            appRecordFields.SYSTEM.key,
            searchTerm,
        ]
    );
    if (error) {
        return <SearchError error={error} baseId={baseId} />;
    }
    if (
        status !== constants.LOADING &&
        (!data || data.length === 0 || data[0].apps.length === 0)
    ) {
        return <Typography>{t("noResults")}</Typography>;
    }

    let flatData = [];
    if (data && data.length > 0) {
        data.forEach((page) => {
            flatData = [...flatData, ...page.apps];
        });
    }

    return (
        <>
            <SearchResultsTable
                columns={columns}
                data={flatData}
                baseId={baseId}
                loading={status === constants.LOADING}
                fetchMore={fetchMore}
                isFetchingMore={isFetchingMore}
                canFetchMore={canFetchMore}
                initialSortBy={[
                    { id: orderBy, desc: order === constants.SORT_DESCENDING },
                ]}
                onSort={(colId, descending) => {
                    setOrderBy(colId);
                    descending
                        ? setOrder(constants.SORT_DESCENDING)
                        : setOrder(constants.SORT_ASCENDING);
                }}
            />
        </>
    );
}
