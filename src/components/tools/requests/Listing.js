/**
 * @author sriram
 *
 * A component intended to list all the tool requests in a table view.
 *
 */
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import globalConstants from "../../../constants";
import TableView from "components/tools/requests/TableView";
import RequestType from "components/models/RequestType";
import UpdateRequestDialog from "components/utils/UpdateRequestDialog";

import {
    ADMIN_TOOL_REQUESTS_QUERY_KEY,
    getAdminToolRequests,
} from "serviceFacades/tools";

function Listing(props) {
    const { baseId, order, orderBy, onRouteToRequestsListing } = props;

    const [data, setData] = useState(null);
    const [selected, setSelected] = useState();
    const [updateDialogOpen, setUpdateDialogOpen] = useState();

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const { isFetching, error } = useQuery({
        queryKey: [ADMIN_TOOL_REQUESTS_QUERY_KEY, { order, orderBy }],
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
                property
            );
    };

    const handleClick = (event, id, index) => {
        setSelected(id);
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

            <UpdateRequestDialog
                requestType={RequestType.TOOL}
                open={updateDialogOpen}
                onClose={() => {
                    setUpdateDialogOpen(false);
                    queryClient.invalidateQueries(
                        ADMIN_TOOL_REQUESTS_QUERY_KEY
                    );
                }}
                requestId={selected}
            />
        </>
    );
}

export default Listing;
