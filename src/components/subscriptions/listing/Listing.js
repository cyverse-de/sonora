/**
 * @author sboleyn
 *
 * A component intended to be the parent to the subscriptions table view
 *
 */

import React, { useState } from "react";
import { useQuery } from "react-query";
import TableView from "./TableView";
import SubscriptionToolbar from "../toolbar/Toolbar";

import DEPagination from "components/utils/DEPagination";

import withErrorAnnouncer from "../../error/withErrorAnnouncer";
import {
    getSubscriptions,
    SUBSCRIPTIONS_QUERY_KEY,
} from "serviceFacades/subscriptions";
import constants from "../../../constants";

function Listing(props) {
    const {
        baseId,
        isAdminView,
        onRouteToListing,
        order,
        orderBy,
        page,
        rowsPerPage,
        searchTerm,
    } = props;
    const [data, setData] = useState(null);
    // const [selected, setSelected] = useState([]);
    // const [subscriptionsQueryKey, setSubscriptionsQueryKey] = useState(SUBSCRIPTIONS_QUERY_KEY)

    const { isFetching, error } = useQuery({
        queryKey: [
            SUBSCRIPTIONS_QUERY_KEY,
            {
                order,
                orderBy,
                page,
                rowsPerPage,
                searchTerm,
                isAdminView,
            },
        ],
        queryFn: () =>
            getSubscriptions({ searchTerm, order, orderBy, page, rowsPerPage }),
        enabled: true,
        onSuccess: (resp) => {
            // setData(resp.result.subscriptions);
            setData(resp.result);
        },
    });

    const handleChangePage = (_, newPage) => {
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                newPage - 1,
                rowsPerPage,
                searchTerm
            );
    };

    const handleChangeRowsPerPage = (newPageSize) => {
        onRouteToListing &&
            onRouteToListing(
                order,
                orderBy,
                0,
                parseInt(newPageSize, 10),
                searchTerm
            );
    };

    const handleRequestSort = (_, field) => {
        const isAsc = orderBy === field && order === constants.SORT_ASCENDING;
        onRouteToListing &&
            onRouteToListing(
                isAsc ? constants.SORT_DESCENDING : constants.SORT_ASCENDING,
                field,
                page,
                rowsPerPage,
                searchTerm
            );
    };

    const handleSearch = (term) => {
        // setSelected([]);
        onRouteToListing &&
            onRouteToListing(order, orderBy, page, rowsPerPage, term);
    };

    return (
        <>
            <SubscriptionToolbar
                baseId={baseId}
                handleSearch={handleSearch}
                isAdminView={isAdminView}
                searchTerm={searchTerm}
            />
            <TableView
                baseId={baseId}
                error={error}
                handleRequestSort={handleRequestSort}
                isAdminView={isAdminView}
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

// Do i need this error announcer?
export default withErrorAnnouncer(Listing);
