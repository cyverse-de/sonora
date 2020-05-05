import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import TableView from "./TableView";
import { getTools } from "../../../serviceFacades/tools";
import { injectIntl } from "react-intl";
import { withI18N } from "@cyverse-de/ui-lib";
import messages from "../Messages";
import DEPagination from "../../utils/DEPagination";

/**
 * Returns the tool listing component.
 * @param {Object} props - the component properties
 */
function Listing(props) {
    const { baseId } = props;

    // Data and data retrieval state variables.
    const [data, setData] = useState(null);
    const [toolsKey, setToolsKey] = useState(null);

    // Result ordering state variables.
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");

    // Pagination state variables.
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        setToolsKey(["getTools", { order, orderBy, page, rowsPerPage }]);
    }, [order, orderBy, page, rowsPerPage]);

    // Fetches tool listings from the API.
    const { isFetching, error } = useQuery({
        queryKey: toolsKey,
        queryFn: getTools,
        config: {
            onSuccess: setData,
        },
    });

    // Handles a request to sort the tools.
    const handleRequestSort = (_, property) => {
        setOrder(orderBy === property && order === "asc" ? "desc" : "asc");
        setOrderBy(property);
        setPage(0);
    };

    // Handles a request to change the page being displayed.
    const handleChangePage = (_, newPage) => {
        setPage(newPage - 1);
    };

    // Handles a request to chagne the number of rows per page.
    const handleChangeRowsPerPage = (newPageSize) => {
        setRowsPerPage(parseInt(newPageSize, 10));
        setPage(0);
    };

    return (
        <>
            <TableView
                baseId={baseId}
                error={error}
                handleRequestSort={handleRequestSort}
                listing={data}
                loading={isFetching}
                order={order}
                orderBy={orderBy}
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
