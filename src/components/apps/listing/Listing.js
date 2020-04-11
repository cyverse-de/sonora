/**
 * @author sriram
 *
 *  A component intended to be the parent to the apps's table view and
 * thumbnail/tile view.
 *
 */
import React, { useEffect, useState } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import {
    appFavorite,
    getAppDetails,
    getApps,
    getAppsInCategory,
    rateApp,
} from "../../../serviceFacade/appServiceFacade";
import TableView from "./TableView";
import Header from "../Header";
import AppNavigation from "../AppNavigation";
import { getFilters } from "../AppNavigation";
import constants from "../../../constants";
import AgaveAuthPromptDialog from "../AgaveAuthPromptDialog";
import Drawer from "../details/Drawer";
import appType from "../../models/AppType";
import {
    announce,
    formatMessage,
    withI18N,
    AnnouncerConstants,
} from "@cyverse-de/ui-lib";
import { injectIntl } from "react-intl";
import intlData from "../messages";
import DEPagination from "../../utils/DEPagination";

function Listing(props) {
    const { baseId, intl } = props;
    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [appsInCategoryKey, setAppsInCategoryKey] = useState(null);
    const [filter, setFilter] = useState(getFilters()[0]);
    const [allAppsKey, setAllAppsKey] = useState(null);
    const [data, setData] = useState(null);
    const [agaveAuthDialogOpen, setAgaveAuthDialogOpen] = useState(false);
    const [detailsEnabled, setDetailsEnabled] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsApp, setDetailsApp] = useState(null);
    const [details, setDetails] = useState(null);
    const [detailsKey, setDetailsKey] = useState(null);

    //a query with falsy key will not execute until key is set truthy val
    const {
        status: appInCategoryStatus,
        error: appsInCategoryError,
    } = useQuery({
        queryKey: appsInCategoryKey,
        queryFn: getAppsInCategory,
        config: {
            onSuccess: setData,
        },
    });

    const { status: allAppsStatus, error: listingError } = useQuery({
        queryKey: allAppsKey,
        queryFn: getApps,
        config: {
            onSuccess: setData,
        },
    });

    const { status: detailsStatus, error: detailsError } = useQuery({
        queryKey: detailsKey,
        queryFn: getAppDetails,
        config: {
            onSuccess: setDetails,
        },
    });

    const [
        favorite,
        { status: favMutationStatus, error: favMutationError },
    ] = useMutation(appFavorite, {
        onSuccess: () =>
            //return a promise so mutate() only resolves after the onSuccess callback
            queryCache.refetchQueries(
                appsInCategoryKey ? appsInCategoryKey : allAppsKey
            ),
    });

    const [
        rating,
        { status: ratingMutationStatus, error: ratingMutationError },
    ] = useMutation(rateApp, {
        onSuccess: () =>
            //return a promise so mutate() only resolves after the onSuccess callback
            queryCache.refetchQueries(
                appsInCategoryKey ? appsInCategoryKey : allAppsKey
            ),
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
                "getApps",
                {
                    rowsPerPage,
                    orderBy,
                    order,
                    page,
                    appTypeFilter,
                },
            ]);
            setAppsInCategoryKey(null);
        } else if (systemId && categoryId) {
            setAppsInCategoryKey([
                "getAppsInCategory",
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
            setAllAppsKey(null);
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
        setDetailsEnabled(selected && selected.length === 1);
    }, [selected]);

    useEffect(() => {
        if (detailsApp) {
            setDetailsKey([
                "getAppsDetails",
                {
                    systemId: detailsApp.system_id,
                    appId: detailsApp.id,
                },
            ]);
        }
    }, [detailsApp]);

    useEffect(() => {
        if (appsInCategoryError || listingError) {
            setData(null);
            announce({
                text: formatMessage(intl, "appListingError"),
                variant: AnnouncerConstants.ERROR,
            });
        }
    }, [appsInCategoryError, listingError, intl]);

    useEffect(() => {
        if (detailsError) {
            setDetails(null);
            announce({
                text: formatMessage(intl, "appDetailsError"),
                variant: AnnouncerConstants.ERROR,
            });
        }
    }, [detailsError, intl]);

    useEffect(() => {
        if (favMutationError) {
            announce({
                text: formatMessage(intl, "favMutationError"),
                variant: AnnouncerConstants.ERROR,
            });
        }
    }, [favMutationError, intl]);

    useEffect(() => {
        if (ratingMutationError) {
            announce({
                text: formatMessage(intl, "ratingMutationError"),
                variant: AnnouncerConstants.ERROR,
            });
        }
    }, [ratingMutationError, intl]);

    const toggleDisplay = () => {
        setGridView(!isGridView);
    };

    const select = (appIds) => {
        let newSelected = [...selected];
        appIds.forEach((appId) => {
            const selectedIndex = selected.indexOf(appId);
            if (selectedIndex === -1) {
                newSelected.push(appId);
            }
        });

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
        const rangeIds = [];
        for (let i = start; i <= end; i++) {
            rangeIds.push(data?.apps[i].id);
        }

        let isTargetSelected = selected.includes(targetId);

        isTargetSelected ? deselect(rangeIds) : select(rangeIds);
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


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
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

    const handleCategoryChange = (selectedCategory) => {
        if (
            selectedCategory.system_id?.toLowerCase() ===
            appType.agave.toLowerCase()
        ) {
            setFilter(null);
        }
        setSelectedCategory(selectedCategory);
        setSelected([]);
        setPage(0);
    };

    const handleFilterChange = (filter) => {
        setFilter(filter);
        setSelected([]);
        setPage(0);
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
    };

    return (
        <>
            <AgaveAuthPromptDialog
                baseId={baseId}
                open={agaveAuthDialogOpen}
                location={data?.Location}
                handleClose={() => setAgaveAuthDialogOpen(false)}
            />
            <AppNavigation
                handleCategoryChange={handleCategoryChange}
                handleFilterChange={handleFilterChange}
                baseId={baseId}
                filter={filter}
                selectedCategory={selectedCategory}
            />
            <Header
                baseId={baseId}
                isGridView={isGridView}
                toggleDisplay={toggleDisplay}
                detailsEnabled={detailsEnabled}
                onDetailsSelected={onDetailsSelected}
            />
            <TableView
                loading={
                    appInCategoryStatus === constants.LOADING ||
                    allAppsStatus === constants.LOADING
                }
                error={appsInCategoryError || listingError}
                listing={data}
                baseId={baseId}
                order={order}
                orderBy={orderBy}
                selected={selected}
                handleSelectAllClick={handleSelectAllClick}
                handleClick={handleClick}
                handleRequestSort={handleRequestSort}
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
                    error={
                        detailsError || favMutationError || ratingMutationError
                    }
                    onRatingChange={onRatingChange}
                    onDeleteRatingClick={onDeleteRating}
                    />)}
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
