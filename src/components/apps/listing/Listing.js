/**
 * @author sriram
 *
 *  A component intended to be the parent to the apps's table view and
 * thumbnail/tile view.
 *
 */
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
    getApps,
    getAppsInCategory,
} from "../../../serviceFacade/appServiceFacade";
import TableView from "./TableView";
import { TablePagination } from "@material-ui/core";
import Header from "../Header";
import AppNavigation from "../AppNavigation";
import constants from "../../../constants";
import AgaveAuthPromptDialog from "../AgaveAuthPromptDialog";

function Listing(props) {
    const { baseId } = props;
    const [isGridView, setGridView] = useState(false);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [selected, setSelected] = useState([]);
    const [lastSelectIndex, setLastSelectIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [appsInCategoryKey, setAppsInCategoryKey] = useState(null);
    const [filter, setFilter] = useState(null);
    const [allAppsKey, setAllAppsKey] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [agaveAuthDialogOpen, setAgaveAuthDialogOpen] = useState(false);

    //a query with falsy key will not execute until key is set truthy val
    const { status } = useQuery({
        queryKey: appsInCategoryKey,
        queryFn: getAppsInCategory,
        config: {
            onSuccess: setData,
            refetchOnWindowFocus: false,
            onError: setError,
        },
    });

    const { status: allAppsStatus } = useQuery({
        queryKey: allAppsKey,
        queryFn: getApps,
        config: {
            onSuccess: setData,
            refetchOnWindowFocus: false,
            onError: setError,
        },
    });

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
                    page,
                    categoryId,
                    appTypeFilter,
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
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        setPage(0);
    };

    const handleCategoryChange = (selectedCategory) => {
        if (selectedCategory.system_id === "agave") {
            setFilter(null);
        }
        setSelectedCategory(selectedCategory);
        setPage(0);
    };

    const handleFilterChange = (filter) => {
        setFilter(filter);
        setPage(0);
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
            />
            <TableView
                loading={status === "loading" || allAppsStatus === "loading"}
                error={error}
                listing={data}
                baseId={baseId}
                order={order}
                orderBy={orderBy}
                selected={selected}
                handleSelectAllClick={handleSelectAllClick}
                handleClick={handleClick}
                handleRequestSort={handleRequestSort}
            />
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data?.total ? data.total : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
    );
}
export default Listing;