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
        rowsPerPage,
        searchTerm,
    } = props;
    const [data, setData] = useState(null);
    // const [selected, setSelected] = useState([]);
    // const [subscriptionsQueryKey, setSubscriptionsQueryKey] = useState(SUBSCRIPTIONS_QUERY_KEY)

    // const {isFetching: getSubscriptionsStatus, error: getSubscriptionsError} =
    useQuery({
        queryKey: [
            SUBSCRIPTIONS_QUERY_KEY,
            {
                searchTerm,
                order,
                orderBy,
                rowsPerPage,
            },
        ],
        queryFn: () => getSubscriptions({ searchTerm, order, orderBy }),
        enabled: true,
        onSuccess: (resp) => {
            setData(resp.result.subscriptions); //array of objects
            //[{id: , effective_start_date: , user:{usesrname: ""}, plan: {name: }}
        },
    });

    const handleRequestSort = (_, field) => {
        const isAsc = orderBy === field && order === constants.SORT_ASCENDING;
        onRouteToListing &&
            onRouteToListing(
                isAsc ? constants.SORT_DESCENDING : constants.SORT_ASCENDING,
                field,
                searchTerm
            );
    };

    const handleSearch = (term) => {
        // setSelected([]);
        onRouteToListing && onRouteToListing(order, orderBy, term);
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
                handleRequestSort={handleRequestSort}
                isAdminView={isAdminView}
                listing={data}
                order={order}
                orderBy={orderBy}
            />
        </>
    );
}

// Do i need this error announcer?
export default withErrorAnnouncer(Listing);
