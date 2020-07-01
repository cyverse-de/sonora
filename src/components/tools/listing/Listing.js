import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import TableView from "./TableView";
import { getTools, TOOLS_QUERY_KEY } from "../../../serviceFacades/tools";
import { injectIntl } from "react-intl";
import { withI18N } from "@cyverse-de/ui-lib";
import messages from "../Messages";
import DEPagination from "../../utils/DEPagination";

/**
 * The tool listing component.
 * @param {Object} props - the component properties
 */
function Listing(props) {
    const { baseId } = props;

    // Data and data retrieval state variables.
    const [data, setData] = useState(null);
    const [toolsKey, setToolsKey] = useState(TOOLS_QUERY_KEY);

    // Result ordering state variables.
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");

    // Pagination state variables.
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    // Selection state variables.
    const [selected, setSelected] = useState([]);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(-1);

    useEffect(() => {
        setToolsKey([TOOLS_QUERY_KEY, { order, orderBy, page, rowsPerPage }]);
    }, [order, orderBy, page, rowsPerPage]);

    // Fetches tool listings from the API.
    const { isFetching, error } = useQuery({
        queryKey: toolsKey,
        queryFn: getTools,
        config: {
            enabled: true,
            onSuccess: setData,
        },
    });

    // Handles a request to sort the tools.
    const handleRequestSort = (_, property) => {
        setOrder(orderBy === property && order === "asc" ? "desc" : "asc");
        setOrderBy(property);
        setSelected([]);
        setPage(0);
    };

    // Handles a request to change the page being displayed.
    const handleChangePage = (_, newPage) => {
        setPage(newPage - 1);
    };

    // Handles a request to chagne the number of rows per page.
    const handleChangeRowsPerPage = (newPageSize) => {
        setRowsPerPage(parseInt(newPageSize, 10));
        setSelected([]);
        setPage(0);
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

    return (
        <>
            <TableView
                baseId={baseId}
                error={error}
                handleClick={handleClick}
                handleRequestSort={handleRequestSort}
                handleSelectAllClick={handleSelectAllClick}
                listing={data}
                loading={isFetching}
                order={order}
                orderBy={orderBy}
                selected={selected}
            />
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
        </>
    );
}

export default withI18N(injectIntl(Listing), messages);
