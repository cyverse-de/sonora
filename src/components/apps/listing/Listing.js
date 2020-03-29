/**
 * @author sriram
 *
 *  A component intended to be the parent to the apps's table view and
 * thumbnail/tile view.
 *
 */
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getAppsInCategory } from "../../../serviceFacade/appServiceFacade";
import TableView from "./TableView";
import { TablePagination } from "@material-ui/core";
import Header from "../Header";
import AppNavigation from "../AppNavigation";

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
    const { status, data, error } = useQuery(
        appsInCategoryKey,
        getAppsInCategory
    );

    useEffect(() => {
        const systemId = selectedCategory?.system_id;
        const categoryId = selectedCategory?.id;
        setAppsInCategoryKey([
            "getAppsInCategory",
            { systemId, rowsPerPage, orderBy, order, page, categoryId },
        ]);
    }, [order, orderBy, page, rowsPerPage, selectedCategory]);

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
    };

    const handleCategoryChange = (selectedCategory) => {
        setSelectedCategory(selectedCategory);
    };

    return (
        <>
            <AppNavigation handleCategoryChange={handleCategoryChange} />
            <Header
                baseId={baseId}
                isGridView={isGridView}
                toggleDisplay={toggleDisplay}
            />
            <TableView
                loading={status === "loading"}
                error={status === "error" ? error : ""}
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
                count={data?.total}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
    );
}
export default Listing;
