/**
 * @author sriram
 *
 *  A component intended to be the parent to the apps's table view and
 * thumbnail/tile view.
 *
 */
import React, { useCallback, useEffect, useState } from "react";

import AgaveAuthPromptDialog from "../AgaveAuthPromptDialog";
import Drawer from "../details/Drawer";
import TableView from "./TableView";
import AppsToolbar from "../toolbar/Toolbar";
import ids from "../ids";

import { build } from "@cyverse-de/ui-lib";

import appType from "components/models/AppType";
import DEPagination from "components/utils/DEPagination";

import constants from "../../../constants";

import { useBagAddItems } from "serviceFacades/bags";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import { useTranslation } from "i18n";

import {
    getApps,
    getAppById,
    getAppsInCategory,
    APP_BY_ID_QUERY_KEY,
    ALL_APPS_QUERY_KEY,
    APPS_IN_CATEGORY_QUERY_KEY,
} from "serviceFacades/apps";

import { useQuery } from "react-query";
import { canShare } from "../utils";

import Sharing from "components/sharing";
import { formatSharedApps } from "components/sharing/util";
import AppDoc from "components/apps/details/AppDoc";
import QuickLaunchDialog from "../quickLaunch/QuickLaunchDialog";
import { useUserProfile } from "contexts/userProfile";

function Listing({
    baseId,
    onRouteToApp,
    onRouteToListing,
    selectedSystemId,
    selectedAppId,
    selectedPage,
    selectedRowsPerPage,
    selectedOrder,
    selectedOrderBy,
    selectedFilter,
    selectedCategory,
    showErrorAnnouncer,
}) {
    const { t } = useTranslation(["apps", "common"]);
    const [isGridView, setGridView] = useState(false);
    const [userProfile] = useUserProfile();

    const [order, setOrder] = useState(selectedOrder);
    const [orderBy, setOrderBy] = useState(selectedOrderBy);
    const [page, setPage] = useState(selectedPage);
    const [rowsPerPage, setRowsPerPage] = useState(selectedRowsPerPage);
    const [filter, setFilter] = useState(selectedFilter);
    const [category, setCategory] = useState(selectedCategory);

    const [selected, setSelected] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);

    const [data, setData] = useState(null);
    const [agaveAuthDialogOpen, setAgaveAuthDialogOpen] = useState(false);
    const [detailsEnabled, setDetailsEnabled] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [addToBagEnabled, setAddToBagEnabled] = useState(false);

    const [categoryStatus, setCategoryStatus] = useState(false);
    const [navError, setNavError] = useState(null);

    const getSelectedApps = () => {
        return selected.map((id) => data?.apps.find((app) => app.id === id));
    };

    const shareEnabled = canShare(getSelectedApps());

    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);
    const [docDlgOpen, setDocDlgOpen] = useState(false);
    const [qlDlgOpen, setQLDlgOpen] = useState(false);

    const sharingApps = formatSharedApps(getSelectedApps());

    const {
        isFetching: appInCategoryStatus,
        error: appsInCategoryError,
    } = useQuery({
        queryKey: [
            APPS_IN_CATEGORY_QUERY_KEY,
            {
                systemId: category?.system_id,
                rowsPerPage,
                orderBy,
                order,
                appTypeFilter: filter?.name,
                page,
                categoryId: category?.id,
                userId: userProfile?.id,
            },
        ],
        queryFn: getAppsInCategory,
        config: {
            enabled:
                // Disable the query if the category ID is fake and the user is
                // logged in.  The Navigation component should update the ID to
                // the real ID.
                category?.system_id &&
                category?.id &&
                (!userProfile?.id ||
                    ![constants.APPS_UNDER_DEV, constants.FAV_APPS].includes(
                        category?.id
                    )),
            onSuccess: setData,
        },
    });

    const { isFetching: allAppsStatus, error: listingError } = useQuery({
        queryKey: [
            ALL_APPS_QUERY_KEY,
            {
                rowsPerPage,
                orderBy,
                order,
                page,
                appTypeFilter: filter?.name,
            },
        ],
        queryFn: getApps,
        config: {
            enabled: category?.name === constants.BROWSE_ALL_APPS,
            onSuccess: setData,
        },
    });

    const { isFetching: appByIdStatus, error: appByIdError } = useQuery({
        queryKey: [
            APP_BY_ID_QUERY_KEY,
            { systemId: selectedSystemId, appId: selectedAppId },
        ],
        queryFn: getAppById,
        config: {
            enabled: selectedSystemId && selectedAppId,
            onSuccess: setData,
        },
    });

    useEffect(() => {
        //JSON objects needs to stringified for urls.
        const stringFilter = JSON.stringify(filter);
        const stringCategory = JSON.stringify(category);

        const categoryChanged =
            selectedCategory &&
            category &&
            selectedCategory?.name !== category?.name;
        const filterChanged = selectedFilter?.name !== filter?.name;

        if (
            categoryChanged ||
            filterChanged ||
            selectedOrder !== order ||
            selectedOrderBy !== orderBy ||
            selectedPage !== page ||
            selectedRowsPerPage !== rowsPerPage
        ) {
            onRouteToListing(
                order,
                orderBy,
                page,
                rowsPerPage,
                stringFilter,
                stringCategory
            );
        }
    }, [
        order,
        orderBy,
        page,
        rowsPerPage,
        filter,
        category,
        onRouteToListing,
        selectedFilter,
        selectedOrder,
        selectedOrderBy,
        selectedPage,
        selectedRowsPerPage,
        selectedCategory,
    ]);

    useEffect(() => {
        if (data && data.Location && data.status === 302) {
            setAgaveAuthDialogOpen(true);
        }
    }, [data, setAgaveAuthDialogOpen]);

    useEffect(() => {
        const enabled = selected && selected.length === 1;
        setDetailsEnabled(enabled);
    }, [selected]);

    useEffect(() => {
        setAddToBagEnabled(selected && selected.length > 0);
    }, [selected]);

    useEffect(() => {
        if (data?.apps) {
            const selectedId = selected[0];
            setSelectedApp(data.apps.find((item) => item.id === selectedId));
        } else {
            setSelectedApp(null);
        }
    }, [data, selected]);

    const toggleDisplay = () => {
        setGridView(!isGridView);
    };

    const select = (appIds) => {
        let newSelected = [...new Set([...selected, ...appIds])];
        setSelected(newSelected);
    };

    const deselect = (appIds) => {
        const newSelected = selected.filter(
            (selectedID) => !appIds.includes(selectedID)
        );

        setSelected(newSelected);
    };

    const handleCheckboxClick = (event, id, index) => {
        toggleSelection(id);
        setLastSelectIndex(index);
    };

    const toggleSelection = (appId) => {
        if (selected.includes(appId)) {
            deselect([appId]);
        } else {
            select([appId]);
        }
    };

    // Simple range select: if you shift-click a range, the range will be
    // selected.  If all items in the range are already selected, all items
    // will be deselected.
    const rangeSelect = (start, end, targetId) => {
        if (start > -1) {
            const rangeIds = [];
            for (let i = start; i <= end; i++) {
                rangeIds.push(data?.apps[i].id);
            }

            let isTargetSelected = selected.includes(targetId);
            isTargetSelected ? deselect(rangeIds) : select(rangeIds);
        }
    };

    const handleClick = (event, id, index) => {
        if (event.shiftKey) {
            lastSelectIndex > index
                ? rangeSelect(index, lastSelectIndex, id)
                : rangeSelect(lastSelectIndex, index, id);
        } else {
            setSelected([id]);
        }

        setLastSelectIndex(index);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked && !selected.length) {
            const newSelecteds = data?.apps?.map((app) => app.id) || [];
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        setRowsPerPage(parseInt(newPageSize, 10));
        setSelected([]);
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc =
            orderBy === property && order === constants.SORT_ASCENDING;
        setOrder(isAsc ? constants.SORT_DESCENDING : constants.SORT_ASCENDING);
        setOrderBy(property);
        setSelected([]);
        setPage(0);
    };

    const handleCategoryChange = useCallback((category) => {
        if (category.system_id?.toLowerCase() === appType.agave.toLowerCase()) {
            setFilter(null);
        }
        setCategory(category);
        setSelected([]);
        setPage(0);
    }, []);

    const handleFilterChange = (filter) => {
        setFilter(filter);
        setSelected([]);
        setPage(0);
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
    };

    const addItemsToBag = useBagAddItems({
        handleError: (error) => {
            showErrorAnnouncer(t("addToBagError"), error);
        },
        handleSettled: () => {
            setSelected([]);
        },
    });

    const onAddToBagClicked = () => {
        const items = getSelectedApps().map((item) => ({
            ...item,
            type: "app",
        }));
        addItemsToBag(items);
    };

    const handleAppNavError = useCallback(
        (error) => {
            setNavError(error);
        },
        [setNavError]
    );

    const handleViewAllApps = () => {
        onRouteToListing(
            order,
            orderBy,
            0,
            rowsPerPage,
            null,
            JSON.stringify({
                name: constants.BROWSE_ALL_APPS,
                id: constants.BROWSE_ALL_APPS_ID,
            })
        );
    };

    return (
        <>
            <AgaveAuthPromptDialog
                baseId={baseId}
                open={agaveAuthDialogOpen}
                location={data?.Location}
                handleClose={() => setAgaveAuthDialogOpen(false)}
            />
            <AppsToolbar
                handleCategoryChange={handleCategoryChange}
                handleFilterChange={handleFilterChange}
                viewAllApps={
                    selectedSystemId && selectedAppId ? handleViewAllApps : null
                }
                baseId={baseId}
                filter={filter}
                selectedCategory={selectedCategory}
                setCategoryStatus={setCategoryStatus}
                handleAppNavError={handleAppNavError}
                isGridView={isGridView}
                toggleDisplay={toggleDisplay}
                detailsEnabled={detailsEnabled}
                onDetailsSelected={onDetailsSelected}
                addToBagEnabled={addToBagEnabled}
                onAddToBagClicked={onAddToBagClicked}
                canShare={shareEnabled}
                selectedApps={getSelectedApps()}
                setSharingDlgOpen={setSharingDlgOpen}
                onDocSelected={() => setDocDlgOpen(true)}
                onQLSelected={() => setQLDlgOpen(true)}
            />
            <TableView
                loading={
                    appInCategoryStatus ||
                    allAppsStatus ||
                    categoryStatus ||
                    appByIdStatus
                }
                error={
                    appsInCategoryError ||
                    listingError ||
                    navError ||
                    appByIdError
                }
                listing={data}
                baseId={baseId}
                order={order}
                orderBy={orderBy}
                selected={selected}
                handleSelectAllClick={handleSelectAllClick}
                handleCheckboxClick={handleCheckboxClick}
                handleClick={handleClick}
                handleRequestSort={handleRequestSort}
                onRouteToApp={onRouteToApp}
                canShare={shareEnabled}
                onDetailsSelected={onDetailsSelected}
                setSharingDlgOpen={setSharingDlgOpen}
                onDocSelected={() => setDocDlgOpen(true)}
                onQLSelected={() => setQLDlgOpen(true)}
            />

            {detailsOpen && (
                <Drawer
                    appId={selectedApp?.id}
                    systemId={selectedApp?.system_id}
                    open={detailsOpen}
                    baseId={baseId}
                    onClose={() => setDetailsOpen(false)}
                />
            )}
            {data && data.total > 0 && (
                <DEPagination
                    page={page + 1}
                    onChange={handleChangePage}
                    totalPages={Math.ceil(data.total / rowsPerPage)}
                    onPageSizeChange={handleChangeRowsPerPage}
                    pageSize={rowsPerPage}
                    baseId={baseId}
                />
            )}
            <Sharing
                open={sharingDlgOpen}
                onClose={() => setSharingDlgOpen(false)}
                resources={sharingApps}
            />
            <AppDoc
                baseId={build(baseId, ids.DOCUMENTATION)}
                open={docDlgOpen}
                appId={selectedApp?.id}
                systemId={selectedApp?.system_id}
                name={selectedApp?.name}
                onClose={() => setDocDlgOpen(false)}
            />
            <QuickLaunchDialog
                baseDebugId={build(baseId, ids.APP_QUICK_LAUNCH)}
                appName={selectedApp?.name}
                appId={selectedApp?.id}
                systemId={selectedApp?.system_id}
                open={qlDlgOpen}
                onClose={() => setQLDlgOpen(false)}
            />
        </>
    );
}

export default withErrorAnnouncer(Listing);
