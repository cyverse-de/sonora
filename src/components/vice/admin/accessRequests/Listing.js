/**
 * @author sriram
 *
 * A component intended to list all VICE access requests in a table view.
 *
 */

import React from "react";
import { useQuery } from "react-query";
import { useTranslation } from "i18n";
import {
    adminRequestListing,
    ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY,
} from "serviceFacades/vice/accessRequest";
import TableView from "./TableView";
import TableLoading from "components/utils/TableLoading";
import ErrorHandler from "components/utils/error/ErrorHandler";

export default function Listing(props) {
    const { baseId } = props;
    const { t } = useTranslation("vice-admin");
    const [data, setData] = React.useState(null);

    const { isFetching, error } = useQuery({
        queryKey: [ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY],
        queryFn: adminRequestListing,
        config: {
            enabled: true,
            onSuccess: setData,
        },
    });
    if (error) {
        return <ErrorHandler errorObject={error} />;
    }
    if (isFetching || !data) {
        return <TableLoading rows={10} />;
    } else {
        return <TableView data={data?.requests} />;
    }
}
