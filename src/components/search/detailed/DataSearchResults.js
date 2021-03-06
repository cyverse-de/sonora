/**
 *
 * Display tabular view of detailed data search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useQuery, queryCache } from "react-query";
import Link from "next/link";
import { useTranslation } from "i18n";

import DELink from "components/utils/DELink";

import constants from "../../../constants";
import SearchResultsTable from "./SearchResultsTable";
import { useDataSearchInfinite } from "../searchQueries";
import searchConstants from "../constants";

import {
    DATA_SEARCH_QUERY_KEY,
    INFO_TYPES_QUERY_KEY,
    getInfoTypes,
} from "serviceFacades/filesystem";
import { BOOTSTRAP_KEY } from "serviceFacades/users";

import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import dataFields from "components/data/dataFields";
import ResourceIcon from "components/data/listing/ResourceIcon";
import { useDataNavigationLink } from "components/data/utils";

import DetailsDrawer from "components/data/details/Drawer";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { IconButton, Typography } from "@material-ui/core";
import { Info } from "@material-ui/icons";

function Name(props) {
    const { resource, searchTerm } = props;

    const type = resource._type;
    let path = resource._source.path;

    const [href, as] = useDataNavigationLink(path, resource?._id, type);
    return (
        <Link href={href} as={as} passHref>
            <DELink text={resource._source?.label} searchTerm={searchTerm} />
        </Link>
    );
}

function DataSearchResults(props) {
    const { searchTerm, updateResultCount, baseId, showErrorAnnouncer } = props;
    const [dataSearchKey, setDataSearchKey] = useState(DATA_SEARCH_QUERY_KEY);
    const [sortField, setSortField] = useState("label");
    const [sortOrder, setSortOrder] = useState("ascending");
    const [dataSearchQueryEnabled, setDataSearchQueryEnabled] = useState(false);
    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [infoTypes, setInfoTypes] = useState([]);
    const { t } = useTranslation("search");
    const { t: dataI18n } = useTranslation("data");
    const dataRecordFields = dataFields(dataI18n);

    const bootstrapCache = queryCache.getQueryData(BOOTSTRAP_KEY);
    let userHomeDir = bootstrapCache?.data_info.user_home_path;
    if (userHomeDir) {
        userHomeDir = userHomeDir + "/";
    }

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    useEffect(() => {
        if (!infoTypesCache || infoTypesCache.length === 0) {
            setInfoTypesQueryEnabled(true);
        } else {
            if (infoTypes === null || infoTypes.length === 0) {
                setInfoTypes(infoTypesCache.types);
            }
        }
    }, [infoTypes, infoTypesCache]);

    useQuery({
        queryKey: INFO_TYPES_QUERY_KEY,
        queryFn: getInfoTypes,
        config: {
            enabled: infoTypesQueryEnabled,
            onSuccess: (resp) => setInfoTypes(resp.types),
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                showErrorAnnouncer(dataI18n("infoTypeFetchError"), e);
            },
        },
    });

    const {
        status,
        data,
        isFetchingMore,
        fetchMore,
        canFetchMore,
        error,
    } = useDataSearchInfinite(
        dataSearchKey,
        dataSearchQueryEnabled,
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
            setDataSearchKey([
                DATA_SEARCH_QUERY_KEY,
                {
                    searchTerm,
                    userHomeDir,
                    rowsPerPage: searchConstants.DETAILED_SEARCH_PAGE_SIZE,
                    sortField: sortField,
                    sortDir: sortOrder,
                },
            ]);
            setDataSearchQueryEnabled(true);
        }
    }, [searchTerm, sortField, sortOrder, userHomeDir]);

    useEffect(() => {
        if (data && data.length > 0) {
            updateResultCount(data[0].total);
        }
    }, [data, updateResultCount]);

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                accessor: "icon",
                Cell: ({ row }) => {
                    const original = row?.original;
                    return <ResourceIcon type={original._type} />;
                },
                disableSortBy: true,
            },
            {
                Header: dataRecordFields.NAME.fieldName,
                accessor: "_source.label",
                Cell: ({ row }) => (
                    <Name resource={row?.original} searchTerm={searchTerm} />
                ),
            },
            {
                Header: dataRecordFields.PATH.fieldName,
                accessor: "_source.path",
                disableSortBy: true,
            },
            {
                Header: "",
                accessor: "actions",
                Cell: ({ row }) => {
                    const original = row?.original;
                    return (
                        <IconButton
                            onClick={() => setDetailsResource(original)}
                            size="small"
                            color="primary"
                        >
                            <Info fontSize="small" />
                        </IconButton>
                    );
                },
                disableSortBy: true,
            },
        ],
        [dataRecordFields, searchTerm]
    );

    if (error) {
        return (
            <ErrorTypographyWithDialog
                errorMessage={t("errorSearch")}
                errorObject={error}
                baseId={baseId}
            />
        );
    }
    if (
        status !== constants.LOADING &&
        (!data || data.length === 0 || data[0]?.hits.length === 0)
    ) {
        return <Typography>{t("noResults")}</Typography>;
    }

    let flatData = [];
    if (data && data.length > 0) {
        data.forEach((page) => {
            flatData = [...flatData, ...page.hits];
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
                    {
                        id: "_source." + sortField,
                        desc: sortOrder === "descending",
                    },
                ]}
                onSort={(colId, descending) => {
                    setSortField(colId.split(".")[1]);
                    descending
                        ? setSortOrder("descending")
                        : setSortOrder("ascending");
                }}
            />
            {detailsResource && (
                <DetailsDrawer
                    resource={detailsResource._source}
                    onClose={() => setDetailsResource(null)}
                    baseId={baseId}
                    open={detailsResource !== null}
                    infoTypes={infoTypes}
                />
            )}
        </>
    );
}
export default withErrorAnnouncer(DataSearchResults);
