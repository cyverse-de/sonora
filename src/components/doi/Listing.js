/**
 * @author sriram
 *
 * A component intended to list all the DOI requests in a table view.
 *
 */
import React, { useState } from "react";
import { useQuery } from "react-query";

import DEPagination from "components/utils/DEPagination";
import globalConstants from "../../constants";
import { adminGetDOIRequests, DOI_LISTING_QUERY_KEY } from "serviceFacades/doi";
import TableView from "./TableView";
import DOIToolbar from "./Toolbar";
import UpdateRequestDialog from "./UpdateRequestDialog";

export default function Listing(props) {
    const {
        baseId,
        order,
        orderBy,
        page,
        rowsPerPage,
        onRouteToListing,
    } = props;

    const [data, setData] = useState(null);
    const [selected, setSelected] = useState();
    const [updateDialogOpen, setUpdateDialogOpen] = useState();
    const { isFetching, error } = useQuery({
        queryKey: [
            DOI_LISTING_QUERY_KEY,
            { order, orderBy, page, rowsPerPage },
        ],
        queryFn: adminGetDOIRequests,
        config: {
            enabled: true,
            onSuccess: setData,
        },
    });

    const handleRequestSort = (event, property) => {
        const isAsc =
            orderBy === property && order === globalConstants.SORT_ASCENDING;
        onRouteToListing &&
            onRouteToListing(
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
        onRouteToListing &&
            onRouteToListing(order, orderBy, newPage - 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        onRouteToListing &&
            onRouteToListing(order, orderBy, 0, parseInt(newPageSize, 10));
    };

    return (
        <>
            <DOIToolbar
                baseId={baseId}
                selected={selected}
                onUpdateClick={() => setUpdateDialogOpen(true)}
            />
            <TableView
                baseId={baseId}
                listing={data}
                error={error}
                loading={isFetching}
                order={order}
                orderBy={orderBy}
                handleRequestSort={handleRequestSort}
                handleClick={handleClick}
                selected={selected}
                onUserNameClick={() => setUpdateDialogOpen(true)}
            />
            {data && data?.requests?.length > 0 && (
                <DEPagination
                    page={page + 1}
                    onChange={handleChangePage}
                    totalPages={Math.ceil(data?.requests?.length / rowsPerPage)}
                    onPageSizeChange={handleChangeRowsPerPage}
                    pageSize={rowsPerPage}
                    baseId={baseId}
                />
            )}
            <UpdateRequestDialog
                open={updateDialogOpen}
                onClose={() => setUpdateDialogOpen(false)}
                requestId={selected}
            />
        </>
    );
}
