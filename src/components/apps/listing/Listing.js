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

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";

import appType from "components/models/AppType";

import ConfirmationDialog from "components/utils/ConfirmationDialog";
import DEPagination from "components/utils/DEPagination";

import appsConstants from "../constants";
import constants from "../../../constants";

import { useBagAddItems } from "serviceFacades/bags";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { useTranslation } from "i18n";

import {
    getApps,
    getAppsForAdmin,
    getAppById,
    getAppsInCategory,
    deleteApp,
    APP_BY_ID_QUERY_KEY,
    ALL_APPS_QUERY_KEY,
    APPS_IN_CATEGORY_QUERY_KEY,
    ADMIN_APPS_QUERY_KEY,
} from "serviceFacades/apps";
import {
    COLLECTION_APPS_QUERY,
    getCollectionApps,
} from "serviceFacades/groups";

import { useQueryClient, useMutation, useQuery } from "react-query";
import { canShare } from "../utils";

import Sharing from "components/sharing";
import { formatSharedApps } from "components/sharing/util";
import AppDoc from "components/apps/details/AppDoc";
import SavedLaunchDialog from "../savedLaunch/SavedLaunchDialog";
import { useUserProfile } from "contexts/userProfile";
import AdminAppDetailsDialog from "../admin/details/AdminAppDetails";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";
import SelectCollectionDialog from "../SelectCollectionDialog";

function Listing(props) {
    const {
        baseId,
        onRouteToListing,
        selectedSystemId,
        selectedAppId,
        page,
        rowsPerPage,
        order,
        orderBy,
        filter,
        category,
        showErrorAnnouncer,
        isAdminView,
        searchTerm,
        adminOwnershipFilter,
    } = props;
    const { t } = useTranslation(["apps", "common"]);
    const [isGridView, setGridView] = useState(false);
    const [userProfile] = useUserProfile();

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

    const getSelectedApps = useCallback(() => {
        // Sometimes selected gets out of sync
        // and contains IDs not in the current data set.
        const apps = data?.apps || [];
        return apps.filter((app) => selected.find((id) => app.id === id));
    }, [data, selected]);

    const shareEnabled = canShare(getSelectedApps());

    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);
    const [docDlgOpen, setDocDlgOpen] = useState(false);
    const [savedLaunchDlgOpen, setSavedLaunchDlgOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectCollectionDlgOpen, setSelectCollectionDlgOpen] =
        useState(false);

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const sharingApps = formatSharedApps(getSelectedApps());

    const { isFetching: appInCategoryStatus, error: appsInCategoryError } =
        useQuery({
            queryKey: [
                APPS_IN_CATEGORY_QUERY_KEY,
                {
                    systemId: category?.system_id,
                    rowsPerPage,
                    orderBy,
                    order,
                    appTypeFilter: filter?.value,
                    page,
                    categoryId: category?.id,
                    userId: userProfile?.id,
                },
            ],
            queryFn: () =>
                getAppsInCategory({
                    systemId: category?.system_id,
                    rowsPerPage,
                    orderBy,
                    order,
                    appTypeFilter: filter?.value,
                    page,
                    categoryId: category?.id,
                    userId: userProfile?.id,
                }),

            enabled:
                // Disable the query if the category ID is fake and the user is
                // logged in.  The Navigation component should update the ID to
                // the real ID.
                !!category?.system_id &&
                !!category?.id &&
                (!userProfile?.id ||
                    ![constants.APPS_UNDER_DEV, constants.FAV_APPS].includes(
                        category?.id
                    )),
            onSuccess: (resp) => {
                trackIntercomEvent(IntercomEvents.VIEWED_APPS, {
                    systemId: category?.system_id,
                    rowsPerPage,
                    orderBy,
                    order,
                    appTypeFilter: filter?.value,
                    page,
                    categoryId: category?.id,
                    userId: userProfile?.id,
                });
                setData(resp);
            },
        });

    const { isFetching: allAppsStatus, error: listingError } = useQuery({
        queryKey: [
            isAdminView ? ADMIN_APPS_QUERY_KEY : ALL_APPS_QUERY_KEY,
            {
                rowsPerPage,
                orderBy,
                order,
                page,
                appTypeFilter: filter?.value,
                searchTerm,
                adminOwnershipFilter: adminOwnershipFilter?.value,
            },
        ],
        queryFn: () => {
            if (isAdminView) {
                return getAppsForAdmin({
                    rowsPerPage,
                    orderBy,
                    order,
                    page,
                    appTypeFilter: filter?.value,
                    searchTerm,
                    adminOwnershipFilter: adminOwnershipFilter?.value,
                });
            } else {
                return getApps({
                    rowsPerPage,
                    orderBy,
                    order,
                    page,
                    appTypeFilter: filter?.value,
                });
            }
        },

        enabled: category?.name === constants.BROWSE_ALL_APPS || isAdminView,
        onSuccess: (resp) => {
            trackIntercomEvent(IntercomEvents.VIEWED_APPS, {
                rowsPerPage,
                orderBy,
                order,
                page,
                appTypeFilter: filter?.value,
                searchTerm,
                adminOwnershipFilter: adminOwnershipFilter?.value,
            });
            setData(resp);
        },
    });

    const { isFetching: appByIdStatus, error: appByIdError } = useQuery({
        queryKey: [
            APP_BY_ID_QUERY_KEY,
            { systemId: selectedSystemId, appId: selectedAppId },
        ],
        queryFn: () =>
            getAppById({ systemId: selectedSystemId, appId: selectedAppId }),
        enabled: !!selectedSystemId && !!selectedAppId,
        onSuccess: (resp) => {
            trackIntercomEvent(IntercomEvents.VIEWED_APPS, {
                systemId: selectedSystemId,
                appId: selectedAppId,
            });
            setData(resp);
        },
    });

    const { isFetching: appsInCollectionStatus, error: appsInCollectionError } =
        useQuery({
            queryKey: [
                COLLECTION_APPS_QUERY,
                {
                    name: category?.fullCollectionName,
                    sortField: orderBy,
                    sortDir: order,
                    appFilter: filter,
                },
            ],
            queryFn: () =>
                getCollectionApps({
                    name: category?.fullCollectionName,
                    sortField: orderBy,
                    sortDir: order,
                    appFilter: filter,
                }),
            enabled: category?.id === constants.MY_COLLECTIONS,
            onSuccess: (resp) => {
                trackIntercomEvent(IntercomEvents.VIEWED_APPS, {
                    systemId: selectedSystemId,
                    appId: selectedAppId,
                });
                setData(resp);
            },
        });

    const { mutate: deleteAppMutation, isLoading: deleteLoading } = useMutation(
        deleteApp,
        {
            onSuccess: () => {
                announce({
                    text: t("appDeleteSuccess", { appName: selectedApp?.name }),
                    variant: SUCCESS,
                });

                setSelected([]);

                if (selectedSystemId && selectedAppId) {
                    queryClient.invalidateQueries([
                        APP_BY_ID_QUERY_KEY,
                        { systemId: selectedSystemId, appId: selectedAppId },
                    ]);
                }

                queryClient.invalidateQueries(APPS_IN_CATEGORY_QUERY_KEY);
            },
            onError: (error) => {
                showErrorAnnouncer(t("appDeleteError"), error);
            },
        }
    );

    useEffect(() => {
        if (data && data.Location && data.status === 302) {
            setAgaveAuthDialogOpen(true);
        }
    }, [data, setAgaveAuthDialogOpen]);

    useEffect(() => {
        const enabled = !!selected && selected.length === 1;
        setDetailsEnabled(enabled);
    }, [selected]);

    useEffect(() => {
        const selectedApps = getSelectedApps();
        setAddToBagEnabled(
            selectedApps &&
                selectedApps.length > 0 &&
                !selectedApps.find((app) => app.is_public)
        );
    }, [getSelectedApps, selected]);

    useEffect(() => {
        // Reset selected whenever the data set changes,
        // which can be due to the browser's back or forward navigation,
        // in addition to the user changing categories or pages.
        setSelected([]);
    }, [data]);

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
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                newPage - 1,
                rowsPerPage,
                JSON.stringify(filter),
                JSON.stringify(category),
                searchTerm,
                JSON.stringify(adminOwnershipFilter)
            );
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                parseInt(newPageSize, 10),
                JSON.stringify(filter),
                JSON.stringify(category),
                searchTerm,
                JSON.stringify(adminOwnershipFilter)
            );
    };

    const handleRequestSort = (event, property) => {
        const isAsc =
            orderBy === property && order === constants.SORT_ASCENDING;

        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                isAsc ? constants.SORT_DESCENDING : constants.SORT_ASCENDING,
                property,
                page,
                rowsPerPage,
                JSON.stringify(filter),
                JSON.stringify(category),
                searchTerm,
                JSON.stringify(adminOwnershipFilter)
            );
    };

    const handleCategoryChange = useCallback(
        (category) => {
            if (category.id === constants.MY_COLLECTIONS) {
                setSelectCollectionDlgOpen(true);
            } else {
                let toFilter = filter;
                if (
                    category.system_id?.toLowerCase() ===
                    appType.agave.value.toLowerCase()
                ) {
                    toFilter = null;
                }
                setSelected([]);
                onRouteToListing &&
                    onRouteToListing(
                        order,
                        orderBy,
                        0,
                        rowsPerPage,
                        toFilter ? JSON.stringify(filter) : null,
                        JSON.stringify(category),
                        searchTerm,
                        JSON.stringify(adminOwnershipFilter)
                    );
            }
        },
        [
            adminOwnershipFilter,
            filter,
            onRouteToListing,
            order,
            orderBy,
            rowsPerPage,
            searchTerm,
        ]
    );

    const onCollectionSelected = (collection) => {
        setSelectCollectionDlgOpen(false);
        let newCategory = {
            id: constants.MY_COLLECTIONS,
            name: collection.name,
            fullCollectionName: collection.display_name,
        };
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                rowsPerPage,
                JSON.stringify(filter),
                JSON.stringify(newCategory),
                searchTerm,
                JSON.stringify(adminOwnershipFilter)
            );
    };

    const handleFilterChange = (filter) => {
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                rowsPerPage,
                JSON.stringify(filter),
                JSON.stringify(category),
                searchTerm,
                JSON.stringify(adminOwnershipFilter)
            );
    };

    const handleAdminOwnershipFilterChange = (adminFilter) => {
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                rowsPerPage,
                JSON.stringify(filter),
                JSON.stringify(category),
                searchTerm,
                JSON.stringify(adminFilter)
            );
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
    };

    const handleDelete = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        setDeleteDialogOpen(false);
        deleteAppMutation({
            systemId: selectedApp?.system_id,
            appId: selectedApp?.id,
        });
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
        setSelected([]);
        onRouteToListing(
            order,
            orderBy,
            0,
            rowsPerPage,
            null,
            JSON.stringify({
                name: constants.BROWSE_ALL_APPS,
                id: constants.BROWSE_ALL_APPS_ID,
            }),
            searchTerm,
            JSON.stringify(adminOwnershipFilter)
        );
    };

    const handleSearch = (term) => {
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                rowsPerPage,
                JSON.stringify(filter),
                JSON.stringify(category),
                term,
                JSON.stringify(adminOwnershipFilter)
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
                selectedCategory={category}
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
                onSavedLaunchSelected={() => setSavedLaunchDlgOpen(true)}
                isAdminView={isAdminView}
                handleSearch={handleSearch}
                searchTerm={searchTerm}
                adminOwnershipFilter={adminOwnershipFilter}
                handleAdminOwnershipFilterChange={
                    handleAdminOwnershipFilterChange
                }
            />
            <TableView
                loading={
                    appInCategoryStatus ||
                    allAppsStatus ||
                    categoryStatus ||
                    deleteLoading ||
                    appByIdStatus ||
                    appsInCollectionStatus
                }
                error={
                    appsInCategoryError ||
                    listingError ||
                    navError ||
                    appByIdError ||
                    appsInCollectionError
                }
                listing={data}
                baseId={baseId}
                order={order}
                orderBy={orderBy}
                selected={selected}
                handleSelectAllClick={handleSelectAllClick}
                handleCheckboxClick={handleCheckboxClick}
                handleClick={handleClick}
                handleDelete={handleDelete}
                handleRequestSort={handleRequestSort}
                canShare={shareEnabled}
                onDetailsSelected={onDetailsSelected}
                setSharingDlgOpen={setSharingDlgOpen}
                onDocSelected={() => setDocDlgOpen(true)}
                onSavedLaunchSelected={() => setSavedLaunchDlgOpen(true)}
                isAdminView={isAdminView}
                searchTerm={searchTerm}
            />

            {detailsOpen && !isAdminView && (
                <Drawer
                    appId={selectedApp?.id}
                    systemId={selectedApp?.system_id}
                    open={detailsOpen}
                    baseId={baseId}
                    onClose={() => setDetailsOpen(false)}
                />
            )}
            {detailsOpen && isAdminView && (
                <AdminAppDetailsDialog
                    open={detailsOpen}
                    parentId={baseId}
                    app={selectedApp}
                    handleClose={() => setDetailsOpen(false)}
                    restrictedChars={appsConstants.APP_NAME_RESTRICTED_CHARS}
                    restrictedStartingChars={
                        appsConstants.APP_NAME_RESTRICTED_STARTING_CHARS
                    }
                    documentationTemplateUrl={
                        appsConstants.DOCUMENTATION_TEMPLATE_URL
                    }
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
                baseId={buildID(baseId, ids.DOCUMENTATION)}
                open={docDlgOpen}
                appId={selectedApp?.id}
                systemId={selectedApp?.system_id}
                name={selectedApp?.name}
                onClose={() => setDocDlgOpen(false)}
            />
            <SavedLaunchDialog
                baseDebugId={buildID(baseId, ids.APP_SAVED_LAUNCH)}
                appName={selectedApp?.name}
                appId={selectedApp?.id}
                systemId={selectedApp?.system_id}
                open={savedLaunchDlgOpen}
                onClose={() => setSavedLaunchDlgOpen(false)}
            />

            <ConfirmationDialog
                open={deleteDialogOpen}
                baseId={buildID(ids.DIALOG, ids.DELETE)}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title={t("common:delete")}
                contentText={t("appDeleteWarning", {
                    appName: selectedApp?.name,
                })}
            />

            <SelectCollectionDialog
                open={selectCollectionDlgOpen}
                onClose={() => setSelectCollectionDlgOpen(false)}
                onCollectionSelected={onCollectionSelected}
            />
        </>
    );
}

export default withErrorAnnouncer(Listing);
