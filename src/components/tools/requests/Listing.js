/**
 * @author sriram
 *
 * A component intended to list all the tool requests in a table view.
 *
 */
import React, { useState, useEffect } from "react";
import { useQuery, queryCache, useMutation } from "react-query";

import { useTranslation } from "i18n";

import { AnnouncerConstants, announce } from "@cyverse-de/ui-lib";

import globalConstants from "../../../constants";
import TableView from "components/tools/requests/TableView";
import DEPagination from "components/utils/DEPagination";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

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
        showErrorAnnouncer,
    } = props;

    const { t } = useTranslation("tools");

    const [data, setData] = useState(null);
    const [selected, setSelected] = useState();

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

    const getSelectedRequest = (id) => {
        const item = id ? id : selected;
        return data?.requests?.find((req) => req.id === item);
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
                selected={selected}
            />
            {data && data?.total > 0 && (
                <DEPagination
                    page={page + 1}
                    onChange={handleChangePage}
                    totalPages={Math.ceil(data?.total / rowsPerPage)}
                    onPageSizeChange={handleChangeRowsPerPage}
                    pageSize={rowsPerPage}
                    baseId={baseId}
                />
            )}
        </>
    );
}

export default withErrorAnnouncer(Listing);
