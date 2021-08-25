import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useTranslation } from "i18n";

import { announce } from "components/announcer/CyVerseAnnouncer";

import TableView from "./TableView";
import Drawer from "components/tools/details/Drawer";
import { getTools, deleteTools, TOOLS_QUERY_KEY } from "serviceFacades/tools";
import DEPagination from "components/utils/DEPagination";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import constants from "../../../constants";
import ToolsToolbar, { TOOL_FILTER_VALUES } from "../toolbar/Toolbar";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

/**
 * The tool listing component.
 * @param {Object} props - the component properties
 */
function Listing(props) {
    const {
        baseId,
        multiSelect = true,
        disableDelete,
        disableEdit,
        disableShare,
        onRouteToListing,
        onToolSelected,
        page,
        rowsPerPage,
        order,
        orderBy,
        permFilter,
        searchTerm,
        showErrorAnnouncer,
        isAdmin,
    } = props;

    const { t } = useTranslation("tools");

    // Data and data retrieval state variables.
    const [data, setData] = useState(null);
    const [toolsKey, setToolsKey] = useState(TOOLS_QUERY_KEY);
    const [toolsListingQueryEnabled, setToolsListingQueryEnabled] =
        useState(false);

    // Selection state variables.
    const [selected, setSelected] = useState([]);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);

    const [selectedTool, setSelectedTool] = useState();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [isSingleSelection, setSingleSelection] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const { mutate: removeTools, status: deleteStatus } = useMutation(
        deleteTools,
        {
            onSuccess: () => {
                announce({
                    text: t("toolDeleted"),
                });
                //reset selection to avoid stale selected state
                setSelected([]);
                queryClient.invalidateQueries(toolsKey);
            },
            onError: (e) => {
                showErrorAnnouncer(t("toolDeleteError"), e);
                //reset selection to avoid stale selected state
                setSelected([]);
                queryClient.invalidateQueries(toolsKey);
            },
        }
    );

    useEffect(() => {
        let displayAll = null;

        if (permFilter) {
            displayAll = permFilter !== TOOL_FILTER_VALUES.MY_TOOLS;
        }

        setToolsKey([
            TOOLS_QUERY_KEY,
            {
                order,
                orderBy,
                page,
                rowsPerPage,
                displayAll,
                searchTerm,
                isAdmin,
            },
        ]);
        setToolsListingQueryEnabled(true);
    }, [order, orderBy, page, rowsPerPage, permFilter, searchTerm, isAdmin]);

    useEffect(() => {
        if (data?.tools) {
            const selectedId = selected[0];
            setSelectedTool(data.tools.find((item) => item.id === selectedId));
        } else {
            setSelectedTool(null);
        }
    }, [data, selected]);

    useEffect(() => {
        if (onToolSelected) {
            onToolSelected(selectedTool);
        }
    }, [selectedTool, onToolSelected]);

    useEffect(() => {
        setSingleSelection(selected && selected.length === 1);
    }, [selected]);

    // Fetches tool listings from the API.
    const { isFetching, error } = useQuery({
        queryKey: toolsKey,
        queryFn: () => getTools(toolsKey[1]),
        enabled: toolsListingQueryEnabled,
        onSuccess: (resp) => {
            trackIntercomEvent(IntercomEvents.VIEWED_TOOLS, toolsKey[1]);
            setData(resp);
        },
    });

    // Handles a request to sort the tools.
    const handleRequestSort = (_, property) => {
        const isAsc =
            orderBy === property && order === constants.SORT_ASCENDING;
        onRouteToListing &&
            onRouteToListing(
                isAsc ? constants.SORT_DESCENDING : constants.SORT_ASCENDING,
                property,
                page,
                rowsPerPage,
                permFilter,
                searchTerm
            );
    };

    // Handles a request to change the page being displayed.
    const handleChangePage = (_, newPage) => {
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                newPage - 1,
                rowsPerPage,
                permFilter,
                searchTerm
            );
    };

    // Handles a request to change the number of rows per page.
    const handleChangeRowsPerPage = (newPageSize) => {
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                parseInt(newPageSize, 10),
                permFilter,
                searchTerm
            );
    };

    const onDetailsSelected = () => {
        setDetailsOpen(true);
    };

    // Determines whether or not a tool is already selected.
    const isSelected = (toolId) => selected.includes(toolId);

    // Adds zero or more tools to the list of selected tools.
    const select = (toolIds) => {
        setSelected(
            multiSelect ? [...new Set([...selected, ...toolIds])] : toolIds
        );
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
        if (multiSelect && event.shiftKey) {
            rangeSelect(lastSelectedIndex, index, id);
        } else {
            toggleSelection(id);
        }
        setLastSelectedIndex(index);
    };

    // Handles a request to select all tools.
    const handleSelectAllClick = (event) => {
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
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                rowsPerPage,
                viewFilter,
                searchTerm
            );
    };

    const handleSearch = (term) => {
        setSelected([]);
        onRouteToListing &&
            onRouteToListing(order, orderBy, 0, rowsPerPage, permFilter, term);
    };

    const onDeleteToolSelected = () => {
        setDeleteConfirm(true);
    };

    return (
        <>
            <ToolsToolbar
                baseId={baseId}
                isSingleSelection={isSingleSelection}
                onDetailsSelected={onDetailsSelected}
                disableDelete={disableDelete}
                disableEdit={disableEdit}
                disableShare={disableShare}
                selected={selected}
                getSelectedTools={getSelectedTools}
                handleOwnershipFilterChange={handleOwnershipFilterChange}
                handleSearch={handleSearch}
                searchTerm={searchTerm}
                onDeleteToolSelected={onDeleteToolSelected}
                isAdmin={isAdmin}
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
                multiSelect={multiSelect}
                selected={selected}
                isAdmin={isAdmin}
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
