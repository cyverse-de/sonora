/**
 * @author sriram
 *
 * A component intended to list all the tool requests in a table view.
 *
 */
import React, { useState } from "react";
import { useQuery, queryCache } from "react-query";

import globalConstants from "../../../constants";
import TableView from "components/tools/requests/TableView";
import DEPagination from "components/utils/DEPagination";
import RequestType from "components/models/RequestType";
import UpdateRequestDialog from "components/utils/UpdateRequestDialog";

import {
    ADMIN_TOOL_REQUESTS_QUERY_KEY,
    getAdminToolRequests,
} from "serviceFacades/tools";
function Listing(props) {
    const {
        baseId,
        order,
        orderBy,
        page,
        rowsPerPage,
        onRouteToRequestsListing,
    } = props;

    const [data, setData] = useState(null);
    const [selected, setSelected] = useState();
    const [updateDialogOpen, setUpdateDialogOpen] = useState();

    const { isFetching, error } = useQuery({
        queryKey: [
            ADMIN_TOOL_REQUESTS_QUERY_KEY,
            { order, orderBy, page, rowsPerPage },
        ],
        queryFn: getAdminToolRequests,
        config: {
            enabled: true,
            onSuccess: setData,
        },
    });

    const handleRequestSort = (event, property) => {
        const isAsc =
            orderBy === property && order === globalConstants.SORT_ASCENDING;
        onRouteToRequestsListing &&
            onRouteToRequestsListing(
                isAsc
                    ? globalConstants.SORT_DESCENDING
                    : globalConstants.SORT_ASCENDING,
                property,
                page,
                rowsPerPage
            );
    };

    const handleClick = (event, id, index) => {
        setSelected(id);
    };

    const handleChangePage = (event, newPage) => {
        onRouteToRequestsListing &&
            onRouteToRequestsListing(order, orderBy, newPage - 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        onRouteToRequestsListing &&
            onRouteToRequestsListing(
                order,
                orderBy,
                0,
                parseInt(newPageSize, 10)
            );
    };

    const handleStatusClick = (id) => {
        setSelected(id);
        setUpdateDialogOpen(true);
    };

    return (
        <>
            <TableView
                baseId={baseId}
                listing={data}
                error={error}
                loading={isFetching}
                order={order}
                orderBy={orderBy}
                handleRequestSort={handleRequestSort}
                handleClick={handleClick}
                handleStatusClick={handleStatusClick}
            />
            {data && data?.tool_requests.length > 0 && (
                <DEPagination
                    page={page + 1}
                    onChange={handleChangePage}
                    totalPages={Math.ceil(
                        data?.tool_requests.length / rowsPerPage
                    )}
                    onPageSizeChange={handleChangeRowsPerPage}
                    pageSize={rowsPerPage}
                    baseId={baseId}
                />
            )}
            <UpdateRequestDialog
                requestType={RequestType.TOOL}
                open={updateDialogOpen}
                onClose={() => {
                    setUpdateDialogOpen(false);
                    queryCache.invalidateQueries(ADMIN_TOOL_REQUESTS_QUERY_KEY);
                }}
                requestId={selected}
            />
        </>
    );
}

export default Listing;
