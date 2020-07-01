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
import intlData from "../messages";
import AppsToolbar from "../toolbar/Toolbar";

import { getAppTypeFilters } from "../toolbar/AppNavigation";

import appType from "../../models/AppType";
import DEPagination from "../../utils/DEPagination";

import constants from "../../../constants";

import {
    appFavorite,
    getAppDetails,
    getApps,
    getAppsInCategory,
    rateApp,
    ALL_APPS_QUERY_KEY,
    APP_DETAILS_QUERY_KEY,
    APPS_IN_CATEGORY_QUERY_KEY,
} from "../../../serviceFacades/apps";

import { withI18N } from "@cyverse-de/ui-lib";

import { injectIntl } from "react-intl";
import { queryCache, useMutation, useQuery } from "react-query";

function Listing({ baseId, onRouteToApp }) {
    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filter, setFilter] = useState(getAppTypeFilters()[0]);

    const [data, setData] = useState(null);
    const [agaveAuthDialogOpen, setAgaveAuthDialogOpen] = useState(false);
    const [detailsEnabled, setDetailsEnabled] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsApp, setDetailsApp] = useState(null);
    const [details, setDetails] = useState(null);

    const [categoryStatus, setCategoryStatus] = useState(false);
    const [navError, setNavError] = useState(null);
    const [detailsError, setDetailsError] = useState(null);
    const [favMutationError, setFavMutationError] = useState(null);
    const [ratingMutationError, setRatingMutationError] = useState(null);

    const [appsInCategoryKey, setAppsInCategoryKey] = useState(
        APPS_IN_CATEGORY_QUERY_KEY
    );
    const [allAppsKey, setAllAppsKey] = useState(ALL_APPS_QUERY_KEY);
    const [detailsKey, setDetailsKey] = useState(APP_DETAILS_QUERY_KEY);

    const [
        appsInCategoryQueryEnabled,
        setAppsInCategoryQueryEnabled,
    ] = useState(false);
    const [allAppsQueryEnabled, setAllAppsQueryEnabled] = useState(false);
    const [detailsQueryEnabled, setDetailsQueryEnabled] = useState(false);

    //a query with falsy key will not execute until key is set truthy val
    const {
        status: appInCategoryStatus,
        error: appsInCategoryError,
    } = useQuery({
        queryKey: appsInCategoryKey,
        queryFn: getAppsInCategory,
        config: {
            enabled: appsInCategoryQueryEnabled,
            onSuccess: setData,
        },
    });

    const { status: allAppsStatus, error: listingError } = useQuery({
        queryKey: allAppsKey,
        queryFn: getApps,
        config: {
            enabled: allAppsQueryEnabled,
            onSuccess: setData,
        },
    });

    const { status: detailsStatus } = useQuery({
        queryKey: detailsKey,
        queryFn: getAppDetails,
        config: {
            enabled: detailsQueryEnabled,
            onSuccess: setDetails,
            onError: (e) => {
                setDetailsError(e);
                setFavMutationError(null);
                setRatingMutationError(null);
            },
        },
    });

    const [favorite, { status: favMutationStatus }] = useMutation(appFavorite, {
        onSuccess: () =>
            //return a promise so mutate() only resolves after the onSuccess callback
            queryCache.invalidateQueries(
                appsInCategoryQueryEnabled ? appsInCategoryKey : allAppsKey
            ),
        onError: (e) => {
            setFavMutationError(e);
            setDetailsError(null);
            setRatingMutationError(null);
        },
    });

    const [rating, { status: ratingMutationStatus }] = useMutation(rateApp, {
        onSuccess: () =>
            //return a promise so mutate() only resolves after the onSuccess callback
            queryCache.invalidateQueries(
                appsInCategoryQueryEnabled ? appsInCategoryKey : allAppsKey
            ),
        onError: (e) => {
            setRatingMutationError(e);
            setDetailsError(null);
            setFavMutationError(null);
        },
    });

    const onFavoriteClick = () => {
        favorite({
            isFav: !detailsApp.is_favorite,
            appId: detailsApp.id,
            systemId: detailsApp.system_id,
        });
    };

    const onRatingChange = (event, value) => {
        rating({
            appId: detailsApp.id,
            systemId: detailsApp.system_id,
            rating: value,
        });
    };

    const onDeleteRating = () => {
        rating({
            appId: detailsApp.id,
            systemId: detailsApp.system_id,
            rating: null,
        });
    };

    useEffect(() => {
        const systemId = selectedCategory?.system_id;
        const categoryId = selectedCategory?.id;
        const categoryName = selectedCategory?.name;
        const appTypeFilter = filter?.name;
        if (categoryName === constants.BROWSE_ALL_APPS) {
            setAllAppsKey([
                ALL_APPS_QUERY_KEY,
                {
                    rowsPerPage,
                    orderBy,
                    order,
                    page,
                    appTypeFilter,
                },
            ]);
            setAllAppsQueryEnabled(true);
            setAppsInCategoryQueryEnabled(false);
        } else if (systemId && categoryId) {
            setAppsInCategoryKey([
                APPS_IN_CATEGORY_QUERY_KEY,
                {
                    systemId,
                    rowsPerPage,
                    orderBy,
                    order,
                    appTypeFilter,
                    page,
                    categoryId,
                },
            ]);
            setAppsInCategoryQueryEnabled(true);
            setAllAppsQueryEnabled(false);
        }
    }, [order, orderBy, page, rowsPerPage, selectedCategory, filter]);

    useEffect(() => {
        if (data && data.Location && data.status === 302) {
            setAgaveAuthDialogOpen(true);
        }
    }, [data, setAgaveAuthDialogOpen]);

    useEffect(() => {
        if (detailsOpen && data?.apps) {
            const selectedId = selected[0];
            setDetailsApp(data.apps.find((item) => item.id === selectedId));
        } else {
            setDetailsApp(null);
        }
    }, [data, detailsOpen, selected]);

    useEffect(() => {
        const enabled = selected && selected.length === 1;
        setDetailsEnabled(enabled);
        setDetailsQueryEnabled(enabled);
    }, [selected]);

    useEffect(() => {
        if (detailsApp) {
            setDetailsKey([
                APP_DETAILS_QUERY_KEY,
                {
                    systemId: detailsApp.system_id,
                    appId: detailsApp.id,
                },
            ]);
            setDetailsQueryEnabled(true);
        } else {
            setDetailsQueryEnabled(false);
        }
    }, [detailsApp]);

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
            toggleSelection(id);
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
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        setSelected([]);
        setPage(0);
    };

    const handleCategoryChange = useCallback(
        (selectedCategory) => {
            if (
                selectedCategory.system_id?.toLowerCase() ===
                appType.agave.toLowerCase()
            ) {
                setFilter(null);
            }
            setSelectedCategory(selectedCategory);
            setSelected([]);
            setPage(0);
        },
        [setFilter, setSelectedCategory, setPage]
    );

    const handleFilterChange = (filter) => {
        setFilter(filter);
        setSelected([]);
        setPage(0);
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
        setRatingMutationError(null);
        setDetailsError(null);
        setFavMutationError(null);
    };

    const handleAppNavError = useCallback(
        (error) => {
            setNavError(error);
        },
        [setNavError]
    );

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
                baseId={baseId}
                filter={filter}
                selectedCategory={selectedCategory}
                setCategoryStatus={setCategoryStatus}
                handleAppNavError={handleAppNavError}
                isGridView={isGridView}
                toggleDisplay={toggleDisplay}
                detailsEnabled={detailsEnabled}
                onDetailsSelected={onDetailsSelected}
            />
            <TableView
                loading={
                    appInCategoryStatus === constants.LOADING ||
                    allAppsStatus === constants.LOADING ||
                    categoryStatus
                }
                error={appsInCategoryError || listingError || navError}
                listing={data}
                baseId={baseId}
                order={order}
                orderBy={orderBy}
                selected={selected}
                handleSelectAllClick={handleSelectAllClick}
                handleClick={handleClick}
                handleRequestSort={handleRequestSort}
                onRouteToApp={onRouteToApp}
            />
            {detailsOpen && (
                <Drawer
                    selectedApp={detailsApp}
                    open={detailsOpen}
                    baseId={baseId}
                    onClose={() => setDetailsOpen(false)}
                    onFavoriteClick={onFavoriteClick}
                    details={details}
                    detailsLoadingStatus={detailsStatus === constants.LOADING}
                    ratingMutationStatus={
                        ratingMutationStatus === constants.LOADING
                    }
                    favMutationStatus={favMutationStatus === constants.LOADING}
                    onRatingChange={onRatingChange}
                    onDeleteRatingClick={onDeleteRating}
                    detailsError={detailsError}
                    favMutationError={favMutationError}
                    ratingMutationError={ratingMutationError}
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
        </>
    );
}

export default withI18N(injectIntl(Listing), intlData);
