/**
 * @author sriram
 *
 * A component intended to list all VICE access requests in a table view.
 *
 */

import React from "react";
import { useQuery, queryCache, useMutation } from "react-query";
import { useTranslation } from "i18n";

import { AnnouncerConstants, announce, build } from "@cyverse-de/ui-lib";

import {
    adminRequestListing,
    adminUpdateRequestStatus,
    ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY,
} from "serviceFacades/vice/accessRequest";

import TableView from "./TableView";
import TableLoading from "components/utils/TableLoading";
import ErrorHandler from "components/utils/error/ErrorHandler";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

function Listing(props) {
    const { baseId, showErrorAnnouncer } = props;
    const { t } = useTranslation("vice-admin");
    const [data, setData] = React.useState(null);
    const [showAllRequest, setShowAllRequest] = React.useState(false);

    const handleRequestFilterChange = (event) => {
        setShowAllRequest(event.target.checked);
    };

    const { isFetching, error } = useQuery({
        queryKey: [ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY, { showAllRequest }],
        queryFn: adminRequestListing,
        config: {
            enabled: true,
            onSuccess: setData,
        },
    });

    const [updateRequest, { isLoading: updateLoading }] = useMutation(
        adminUpdateRequestStatus,
        {
            onSuccess: (resp) => {
                announce({
                    text: t("accessRequestUpdateSuccess"),
                    variant: AnnouncerConstants.SUCCESS,
                });
                queryCache.invalidateQueries(
                    ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY
                );
            },
            onError: (error) => {
                showErrorAnnouncer(t("accessRequestUpdateFailure"), error);
            },
        }
    );

    const onUpdateRequest = (id, status, message) => {
        updateRequest({ id, status, message });
    };

    if (error) {
        return <ErrorHandler errorObject={error} />;
    }
    if (isFetching || !data || updateLoading) {
        return <TableLoading rows={10} numColumns={5} />;
    } else {
        return (
            <TableView
                data={data?.requests}
                onUpdateRequest={onUpdateRequest}
                showAllRequest={showAllRequest}
                onRequestFilterChange={handleRequestFilterChange}
            />
        );
    }
}
export default withErrorAnnouncer(Listing);
