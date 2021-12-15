/**
 *
 * Display tabular view of detailed apps search results
 *
 * @author sriram
 *
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";

import SearchResultsTable from "./SearchResultsTable";
import { useAppsSearchInfinite } from "../searchQueries";
import searchConstants from "../constants";
import constants from "../../../constants";
import ids from "../ids";

import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import AppName from "components/apps/AppName";
import { APPS_SEARCH_QUERY_KEY } from "serviceFacades/apps";
import appFields from "components/apps/appFields";
import Drawer from "components/apps/details/Drawer";
import { copyStringToClipboard } from "components/utils/copyStringToClipboard";
import { copyLinkToClipboardHandler } from "components/utils/copyLinkToClipboardHandler";
import CopyLinkButton from "components/utils/CopyLinkButton";
import { getHost } from "components/utils/getHost";
import { getAppListingLinkRefs } from "components/apps/utils";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

import { IconButton, Typography, Grid } from "@material-ui/core";
import { Info } from "@material-ui/icons";

function Name(props) {
    const { selectedOption, searchTerm } = props;
    return (
        <AppName
            name={selectedOption?.name}
            systemId={selectedOption?.system_id}
            appId={selectedOption?.id}
            isDisabled={selectedOption?.disabled}
            searchTerm={searchTerm}
            limitChecks={selectedOption.limitChecks}
        />
    );
}

export function AppActionCell(props) {
    const { app, baseId, onDetailsSelected } = props;
    const partialLink = getAppListingLinkRefs(app?.system_id, app?.id)[1];
    const { t } = useTranslation("common");
    return (
        <Grid container spacing={1}>
            <Grid item>
                <IconButton
                    id={buildID(baseId, ids.DETAILS_BUTTON)}
                    onClick={() => onDetailsSelected(app)}
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
                        const copyPromise = copyStringToClipboard(link);
                        copyLinkToClipboardHandler(t, copyPromise);
                    }}
                />
            </Grid>
        </Grid>
    );
}

export default function AppSearchResults(props) {
    const {
        searchTerm,
        updateResultCount,
        baseId,
        setSelectedApps,
        selectable,
    } = props;
    const [appsSearchKey, setAppsSearchKey] = useState(APPS_SEARCH_QUERY_KEY);
    const [appsSearchQueryEnabled, setAppsSearchQueryEnabled] = useState(false);
    const [detailsApp, setDetailsApp] = useState(null);
    const [flatData, setFlatData] = useState([]);
    const { t } = useTranslation("search");
    const { t: appsI18n } = useTranslation("apps");
    const appRecordFields = appFields(appsI18n);
    const [order, setOrder] = useState(constants.SORT_ASCENDING);
    const [orderBy, setOrderBy] = useState(appRecordFields.NAME.key);
    const {
        status,
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
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
        trackIntercomEvent(IntercomEvents.SEARCHED_APPS, {
            search: searchTerm,
            total: data?.pages.length ? data.pages[0].total : 0,
        });
        if (!searchTerm) {
            updateResultCount(0);
        } else if (data && data.pages.length > 0) {
            updateResultCount && updateResultCount(data.pages[0].total);
            const flat = data.pages.map((page) => page.apps).flat();
            setFlatData(flat);
        }
    }, [data, searchTerm, updateResultCount]);

    const columns = React.useMemo(
        () => [
            {
                Header: appRecordFields.NAME.fieldName,
                accessor: appRecordFields.NAME.key,
                Cell: ({ row }) => (
                    <Name
                        selectedOption={row?.original}
                        searchTerm={searchTerm}
                    />
                ),
            },
            {
                Header: appRecordFields.INTEGRATOR.fieldName,
                accessor: appRecordFields.INTEGRATOR.key,
            },
            {
                Header: appRecordFields.SYSTEM.fieldName,
                accessor: appRecordFields.SYSTEM.key,
            },
            {
                Header: "",
                accessor: "actions",
                Cell: ({ row }) => {
                    const app = row?.original;
                    return (
                        <AppActionCell
                            baseId={baseId}
                            app={app}
                            onDetailsSelected={setDetailsApp}
                        />
                    );
                },
                disableSortBy: true,
            },
        ],
        [
            appRecordFields.INTEGRATOR.fieldName,
            appRecordFields.INTEGRATOR.key,
            appRecordFields.NAME.fieldName,
            appRecordFields.NAME.key,
            appRecordFields.SYSTEM.fieldName,
            appRecordFields.SYSTEM.key,
            baseId,
            searchTerm,
        ]
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
        (!data || data.pages.length === 0 || data.pages[0].apps.length === 0)
    ) {
        return <Typography>{t("noResults")}</Typography>;
    }

    return (
        <>
            <SearchResultsTable
                selectable={selectable}
                setSelectedResources={setSelectedApps}
                columns={columns}
                data={flatData}
                baseId={baseId}
                loading={status === constants.LOADING}
                fetchMore={fetchNextPage}
                isFetchingMore={isFetchingNextPage}
                canFetchMore={hasNextPage}
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
            {detailsApp && (
                <Drawer
                    appId={detailsApp?.id}
                    systemId={detailsApp?.system_id}
                    open={detailsApp !== null}
                    baseId={baseId}
                    onClose={() => setDetailsApp(null)}
                />
            )}
        </>
    );
}
