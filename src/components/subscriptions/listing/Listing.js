/**
 * @author sboleyn
 *
 * A component intended to be the parent to the subscriptions table view
 *
 */

import React, { useState } from "react";
import { useQuery } from "react-query";
import TableView from "./TableView";
import withErrorAnnouncer from "../../error/withErrorAnnouncer";
import {
    getSubscriptions,
    SUBSCRIPTION_SEARCH_QUERY_KEY,
} from "serviceFacades/subscriptions";

function Listing(props) {
    const [data, setData] = useState(null);
    useQuery({
        queryKey: SUBSCRIPTION_SEARCH_QUERY_KEY,
        queryFn: () => getSubscriptions(),
        enabled: true,
        onSuccess: (resp) => {
            setData(resp.result);
        },
    });

    // const {
    //     mutate: null
    //     isLoading: null
    //     error: null
    // } = useMutation ()
    return (
        <>
            <TableView baseId="subscriptions" listing={data} />
        </>
    );
}

// Do i need this error announcer?
export default withErrorAnnouncer(Listing);
