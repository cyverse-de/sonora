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

function Listing(props) {
    const { baseId, isAdminView, onRouteToListing, searchTerm } = props;
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState([]);
    // const [subscriptionsQueryKey, setSubscriptionsQueryKey] = useState(SUBSCRIPTIONS_QUERY_KEY)

    // const {isFetching: getSubscriptionsStatus, error: getSubscriptionsError} =
    useQuery({
        queryKey: [
            SUBSCRIPTIONS_QUERY_KEY,
            {
                searchTerm,
            },
        ],
        queryFn: () => getSubscriptions({ searchTerm }),
        enabled: true,
        onSuccess: (resp) => {
            setData(resp.result.subscriptions); //array of objects
            //[{id: , effective_start_date: , user:{usesrname: ""}, plan: {name: }}
        },
    });
    console.log(selected);
    const handleSearch = (term) => {
        setSelected([]);
        onRouteToListing && onRouteToListing(term);
    };

    return (
        <>
            <SubscriptionToolbar
                handleSearch={handleSearch}
                isAdminView={isAdminView}
                searchTerm={searchTerm}
            />
            <TableView baseId={baseId} listing={data} />
        </>
    );
}

// Do i need this error announcer?
export default withErrorAnnouncer(Listing);
