import React, { useEffect, useState } from "react";
import { useQuery, useMutation, queryCache } from "react-query";
import { useTranslation } from "i18n";

import { announce } from "@cyverse-de/ui-lib";

import TableView from "./TableView";
import Drawer from "components/tools/details/Drawer";
import { getTools, deleteTools, TOOLS_QUERY_KEY } from "serviceFacades/tools";
import DEPagination from "components/utils/DEPagination";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import constants from "../../../constants";
import ToolsToolbar, { TOOL_FILTER_VALUES } from "../toolbar/Toolbar";
import { canShare } from "../utils";

/**
 * The tool listing component.
 * @param {Object} props - the component properties
 */
function Listing(props) {
    const {
        baseId,
        onRouteToListing,
        selectedPage,
        selectedRowsPerPage,
        selectedOrder,
        selectedOrderBy,
        selectedPermFilter,
        selectedSearchTerm,
        showErrorAnnouncer,
    } = props;

    const { t } = useTranslation("tools");

    // Data and data retrieval state variables.
    const [data, setData] = useState(null);
    const [toolsKey, setToolsKey] = useState(TOOLS_QUERY_KEY);
    const [toolsListingQueryEnabled, setToolsListingQueryEnabled] = useState(
        false
    );

    // Result ordering state variables.
    const [order, setOrder] = useState(selectedOrder);
    const [orderBy, setOrderBy] = useState(selectedOrderBy);

    // Filtering options
    const [permFilter, setPermFilter] = useState(selectedPermFilter);
    const [searchTerm, setSearchTerm] = useState(selectedSearchTerm);

    // Pagination state variables.
    const [page, setPage] = useState(selectedPage);
    const [rowsPerPage, setRowsPerPage] = useState(selectedRowsPerPage);

    // Selection state variables.
    const [selected, setSelected] = useState([]);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);

    const [selectedTool, setSelectedTool] = useState();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [isSingleSelection, setSingleSelection] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState();

    useEffect(() => {
        if (
            selectedOrder !== order ||
            selectedOrderBy !== orderBy ||
            selectedPage !== page ||
            selectedRowsPerPage !== rowsPerPage ||
            (permFilter && selectedPermFilter !== permFilter) ||
            (searchTerm && selectedSearchTerm !== searchTerm)
        ) {
            onRouteToListing(
                order,
                orderBy,
                page,
                rowsPerPage,
                permFilter,
                searchTerm
            );
        }
    }, [
        onRouteToListing,
        order,
        orderBy,
        page,
        rowsPerPage,
        permFilter,
        searchTerm,
        selectedOrder,
        selectedOrderBy,
        selectedPage,
        selectedRowsPerPage,
        selectedPermFilter,
        selectedSearchTerm,
    ]);

    const [removeTools, { status: deleteStatus }] = useMutation(deleteTools, {
        onSuccess: () => {
            announce({
                text: t("toolDeleted"),
            });
            //reset selection to avoid stale selected state
            setSelected([]);
            queryCache.invalidateQueries(toolsKey);
        },
        onError: (e) => {
            showErrorAnnouncer(t("toolDeleteError"), e);
            //reset selection to avoid stale selected state
            setSelected([]);
            queryCache.invalidateQueries(toolsKey);
        },
    });

    useEffect(() => {
        let displayAll = null;

        if (permFilter) {
            displayAll = permFilter !== TOOL_FILTER_VALUES.MY_TOOLS;
        }

        setToolsKey([
            TOOLS_QUERY_KEY,
            { order, orderBy, page, rowsPerPage, displayAll, searchTerm },
        ]);
        setToolsListingQueryEnabled(true);
    }, [order, orderBy, page, rowsPerPage, permFilter, searchTerm]);

    useEffect(() => {
        if (data?.tools) {
            const selectedId = selected[0];
            setSelectedTool(data.tools.find((item) => item.id === selectedId));
        } else {
            setSelectedTool(null);
        }
    }, [data, selected]);

    useEffect(() => {
        setSingleSelection(selected && selected.length === 1);
    }, [selected]);

    // Fetches tool listings from the API.
    const { isFetching, error } = useQuery({
        queryKey: toolsKey,
        queryFn: getTools,
        config: {
            enabled: toolsListingQueryEnabled,
            onSuccess: setData,
        },
    });

    // Handles a request to sort the tools.
    const handleRequestSort = (_, property) => {
        setOrder(
            orderBy === property && order === constants.SORT_ASCENDING
                ? constants.SORT_DESCENDING
                : constants.SORT_ASCENDING
        );
        setOrderBy(property);
        setSelected([]);
        setPage(0);
    };

    // Handles a request to change the page being displayed.
    const handleChangePage = (_, newPage) => {
        setPage(newPage - 1);
        setSelected([]);
    };

    // Handles a request to change the number of rows per page.
    const handleChangeRowsPerPage = (newPageSize) => {
        setRowsPerPage(parseInt(newPageSize, 10));
        setSelected([]);
        setPage(0);
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
    };

    // Determines whether or not a tool is already selected.
    const isSelected = (toolId) => selected.includes(toolId);

    // Adds zero or more tools to the list of selected tools.
    const select = (toolIds) => {
        setSelected([...new Set([...selected, ...toolIds])]);
    };

    // Removes zero or more tools from the list of selected tools.
    const deselect = (toolIds) => {
        setSelected(selected.filter((id) => !toolIds.includes(id)));
    };

    // Toggles the selection of an individual tool.
    const toggleSelection = (toolId) => {
        isSelected(toolId) ? deselect([toolId]) : select([toolId]);
    };

    // Selects all of the tools in an index range.
    const rangeSelect = (start, end, targetId) => {
        // Ensure that the start index comes before the end index.
        if (start > end) {
            [start, end] = [end, start];
        }

        // Ignore the case where the user hasn't selected a starting index.
        if (start < 0) {
            return;
        }

        // Get the tool IDs for the range that the user selected.
        const rangeIds = [];
        for (let i = start; i <= end; i++) {
            rangeIds.push(data?.tools[i].id);
        }

        // Toggle the selection based on the last tool clicked.
        isSelected(targetId) ? deselect(rangeIds) : select(rangeIds);
    };

    // Handles a click on a single tool.
    const handleClick = (event, id, index) => {
        if (event.shiftKey) {
            rangeSelect(lastSelectedIndex, index, id);
        } else {
            toggleSelection(id);
        }
        setLastSelectedIndex(index);
    };

    // Handles a request to select all tools.
    const handleSelectAllClick = (event) => {
        console.warn("handling a select all event");
        setSelected(
            event.target.checked && !selected.length
                ? data?.tools?.map((tool) => tool.id) || []
                : []
        );
    };

    const getSelectedTools = (tools) => {
        const items = tools || selected;
        return items.map((id) => data?.tools.find((tool) => tool.id === id));
    };

    const handleOwnershipFilterChange = (viewFilter) => {
        setPermFilter(viewFilter);
        setSelected([]);
        setPage(0);
    };

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        setSelected([]);
        setPage(0);
    };

    const onDeleteToolSelected = () => {
        setDeleteConfirm(true);
    };

    const sharingEnabled = canShare(getSelectedTools());

    return (
        <>
            <ToolsToolbar
                baseId={baseId}
                isSingleSelection={isSingleSelection}
                onDetailsSelected={onDetailsSelected}
                canShare={sharingEnabled}
                selected={selected}
                getSelectedTools={getSelectedTools}
                handleOwnershipFilterChange={handleOwnershipFilterChange}
                handleSearch={handleSearch}
                searchTerm={searchTerm}
                onDeleteToolSelected={onDeleteToolSelected}
            />
            <TableView
                baseId={baseId}
                error={error}
                handleClick={handleClick}
                handleRequestSort={handleRequestSort}
                handleSelectAllClick={handleSelectAllClick}
                listing={data}
                loading={isFetching || deleteStatus === constants.LOADING}
                order={order}
                orderBy={orderBy}
                selected={selected}
            />
            {detailsOpen && (
                <Drawer
                    selectedTool={selectedTool}
                    open={detailsOpen}
                    baseId={baseId}
                    onClose={() => setDetailsOpen(false)}
                />
            )}
            {data && data.total > 0 && (
                <DEPagination
                    baseId={baseId}
                    onChange={handleChangePage}
                    onPageSizeChange={handleChangeRowsPerPage}
                    page={page + 1}
                    pageSize={rowsPerPage}
                    totalPages={Math.ceil(data.total / rowsPerPage)}
                />
            )}
            <ConfirmationDialog
                baseId={baseId}
                open={deleteConfirm}
                onConfirm={() => {
                    setDeleteConfirm(false);
                    removeTools({ ids: selected });
                }}
                onClose={() => setDeleteConfirm(false)}
                title={t("delete")}
                contentText={t("confirmDelete")}
            />
        </>
    );
}

export default withErrorAnnouncer(Listing);
