/**
 *
 * Display tabular view of detailed data search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import Link from "next/link";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { ERROR, SUCCESS } from "components/announcer/AnnouncerConstants";

import DELink from "components/utils/DELink";

import constants from "../../../constants";
import SearchResultsTable from "./SearchResultsTable";
import { useDataSearchInfinite } from "../searchQueries";
import searchConstants from "../constants";
import ids from "../ids";
import styles from "./styles";
import { extractTotal } from "../utils";

import {
    DATA_SEARCH_QUERY_KEY,
    getInfoTypes,
    INFO_TYPES_QUERY_KEY,
} from "serviceFacades/filesystem";

import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import dataFields from "components/data/dataFields";
import ResourceIcon from "components/data/listing/ResourceIcon";
import { useDataNavigationLink } from "components/data/utils";

import DetailsDrawer from "components/data/details/Drawer";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { getHost } from "components/utils/getHost";
import { copyStringToClipboard } from "components/utils/copyStringToClipboard";
import { copyLinkToClipboardHandler } from "components/utils/copyLinkToClipboardHandler";
import CopyLinkButton from "components/utils/CopyLinkButton";
import { IntercomEvents, trackIntercomEvent } from "common/intercom";

import { Grid, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { Info, Label } from "@mui/icons-material";
import { makeStyles } from "tss-react/mui";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import SearchButton from "../form/SearchButton";

const useStyles = makeStyles()(styles);

function Name(props) {
    const { resource, searchTerm } = props;

    const type = resource?._type || resource?._source?.doc_type;
    let path = resource._source.path;

    const [href, as] = useDataNavigationLink(path, resource?._id, type);
    return (
        <Link href={href} as={as} passHref legacyBehavior>
            <DELink text={resource._source?.label} searchTerm={searchTerm} />
        </Link>
    );
}

function CopyPathButton(props) {
    const { baseId, onCopyPathSelected } = props;
    const { t } = useTranslation("data");

    return (
        <Tooltip title={t("copyPath")} aria-label={t("copyPath")}>
            <IconButton
                id={buildID(baseId, ids.COPY_PATH_BUTTON)}
                onClick={() => {
                    onCopyPathSelected();
                }}
                size="small"
            >
                <Label fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}

function DataSearchResults(props) {
    const {
        searchTerm,
        advancedDataQuery,
        updateResultCount,
        baseId,
        showErrorAnnouncer,
    } = props;
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
    const [config] = useConfig();
    const [userProfile] = useUserProfile();

    // Get QueryClient from the context
    const queryClient = useQueryClient();
    let infoTypesCache = queryClient.getQueryData(INFO_TYPES_QUERY_KEY);

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
        enabled: infoTypesQueryEnabled,
        onSuccess: (resp) => setInfoTypes(resp.types),
        staleTime: Infinity,
        cacheTime: Infinity,
        onError: (e) => {
            showErrorAnnouncer(dataI18n("infoTypeFetchError"), e);
        },
    });

    const {
        status,
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error,
    } = useDataSearchInfinite(
        dataSearchKey,
        dataSearchQueryEnabled,
        (lastGroup, allGroups) => {
            const totalPages = Math.ceil(
                extractTotal(lastGroup) /
                    searchConstants.DETAILED_SEARCH_PAGE_SIZE
            );
            if (allGroups.length < totalPages) {
                return allGroups.length;
            } else {
                return false;
            }
        }
    );

    useEffect(() => {
        if (searchTerm?.length > 2 || advancedDataQuery) {
            setDataSearchKey([
                DATA_SEARCH_QUERY_KEY,
                {
                    searchTerm,
                    advancedDataQuery,
                    userHomeDir: "",
                    communityDataDir: config?.irods.community_path,
                    isDetailed: true,
                    userProfile,
                    rowsPerPage: searchConstants.DETAILED_SEARCH_PAGE_SIZE,
                    sortField: sortField,
                    sortDir: sortOrder,
                },
            ]);
            setDataSearchQueryEnabled(true);
        }
    }, [
        searchTerm,
        advancedDataQuery,
        config,
        sortField,
        sortOrder,
        userProfile,
    ]);

    useEffect(() => {
        trackIntercomEvent(IntercomEvents.SEARCHED_DATA, {
            search: searchTerm,
            advancedDataQuery,
            total: data?.pages[0] ? extractTotal(data.pages[0]) : 0,
        });
        if (data && data.pages.length > 0) {
            updateResultCount(extractTotal(data.pages[0]));
        }
    }, [advancedDataQuery, data, searchTerm, updateResultCount]);

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                accessor: "icon",
                Cell: ({ row }) => {
                    const original = row?.original;
                    return (
                        <ResourceIcon
                            type={
                                original?._type || original?._source?.doc_type
                            }
                        />
                    );
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
                    const { t: i18nCommon } = useTranslation("common");
                    const partialLink = useDataNavigationLink(
                        original?._source.path,
                        original?._id,
                        original?._type || original?._source?.doc_type
                    )[1];
                    return (
                        <Grid spacing={1}>
                            <Grid item>
                                <IconButton
                                    id={buildID(baseId, ids.DETAILS_BUTTON)}
                                    onClick={() => setDetailsResource(original)}
                                    size="small"
                                    color="primary"
                                >
                                    <Info fontSize="small" />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <CopyLinkButton
                                    baseId={baseId}
                                    onCopyLinkSelected={() => {
                                        const link = `${getHost()}${partialLink}`;
                                        const copyPromise =
                                            copyStringToClipboard(link);
                                        copyLinkToClipboardHandler(
                                            i18nCommon,
                                            copyPromise
                                        );
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <CopyPathButton
                                    baseId={baseId}
                                    onCopyPathSelected={() => {
                                        const copyPromise =
                                            copyStringToClipboard(
                                                original?._source.path
                                            );
                                        copyPromise.then(
                                            () => {
                                                announce({
                                                    text: dataI18n(
                                                        "pathCopied"
                                                    ),
                                                    variant: SUCCESS,
                                                });
                                            },
                                            () => {
                                                announce({
                                                    text: dataI18n(
                                                        "pathCopiedFailed"
                                                    ),
                                                    variant: ERROR,
                                                });
                                            }
                                        );
                                    }}
                                />
                            </Grid>
                        </Grid>
                    );
                },
                disableSortBy: true,
            },
        ],
        [
            dataRecordFields.NAME.fieldName,
            dataRecordFields.PATH.fieldName,
            searchTerm,
            baseId,
            dataI18n,
        ]
    );

    if (error) {
        return (
            <>
                <DataSearchToolbar advancedDataQuery={advancedDataQuery} />
                <ErrorTypographyWithDialog
                    errorMessage={t("errorSearch")}
                    errorObject={error}
                    baseId={baseId}
                />
            </>
        );
    }
    if (
        status !== constants.LOADING &&
        (!data || data.pages.length === 0 || data.pages[0]?.hits?.length === 0)
    ) {
        return (
            <>
                <DataSearchToolbar advancedDataQuery={advancedDataQuery} />
                <Typography>{t("noResults")}</Typography>
            </>
        );
    }

    let flatData = [];
    if (data && data.pages[0].hits?.length > 0) {
        data.pages.forEach((page) => {
            flatData = [...flatData, ...page.hits];
        });
    }

    return (
        <>
            <DataSearchToolbar advancedDataQuery={advancedDataQuery} />
            <SearchResultsTable
                columns={columns}
                data={flatData}
                baseId={baseId}
                loading={status === constants.LOADING}
                fetchMore={fetchNextPage}
                isFetchingMore={isFetchingNextPage}
                canFetchMore={hasNextPage}
                initialSortBy={[
                    {
                        id: "_source." + sortField,
                        desc: sortOrder === "descending",
                    },
                ]}
                onSort={(colId, descending) => {
                    setSortField(colId?.split(".")[1]);
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

function DataSearchToolbar(props) {
    const { advancedDataQuery } = props;
    const { classes } = useStyles();

    // displays each clause's args values i.e. label:myFile.txt prefix:/cyverse/home
    const getQueryDisplayText = (query) => {
        const queryObj = JSON.parse(query);
        const clauses = queryObj?.query?.all;
        return clauses
            ?.map((clause) => {
                const args = clause.args;
                return Object.entries(args).map(([key, value]) => {
                    return `${key}:${value}`;
                });
            })
            .flat()
            .join(" ");
    };

    const queryDisplayText = advancedDataQuery
        ? getQueryDisplayText(advancedDataQuery)
        : null;

    return (
        <Toolbar variant="dense">
            {queryDisplayText && (
                <Typography variant="caption">{queryDisplayText}</Typography>
            )}
            <div className={classes.divider} />
            <SearchButton />
        </Toolbar>
    );
}

export default withErrorAnnouncer(DataSearchResults);
