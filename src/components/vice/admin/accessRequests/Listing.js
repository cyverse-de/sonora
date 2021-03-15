/**
 * @author sriram
 *
 * A component intended to list all VICE access requests in a table view.
 *
 */

import React from "react";
import { useQuery, queryCache, useMutation } from "react-query";
import { useTranslation } from "i18n";

import { build } from "@cyverse-de/ui-lib";

import {
    adminRequestListing,
    adminUpdateRequestStatus,
    ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY,
} from "serviceFacades/vice/accessRequest";

import TableView from "./TableView";

import ErrorHandler from "components/utils/error/ErrorHandler";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import { FormControlLabel, Paper, Switch, Typography } from "@material-ui/core";

function Listing(props) {
    const { baseId, showErrorAnnouncer } = props;
    const { t } = useTranslation("vice-admin");
    const [data, setData] = React.useState(null);
    const [showAllRequest, setShowAllRequest] = React.useState(false);

    const handleRequestFilterChange = (event) => {
        setShowAllRequest(event.target.checked);
    };

    const { isFetching, error: listingError } = useQuery({
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
            onSuccess: (resp, { user }) => {
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

    const loading = isFetching || updateLoading;

    if (listingError) {
        return <ErrorHandler errorObject={listingError} />;
    }

    return (
        <Paper style={{ marginTop: 16, marginBottom: 16 }}>
            <div style={{ padding: 16 }}>
                <Typography variant="h6" component="span">
                    Access Requests
                </Typography>
                <FormControlLabel
                    style={{ float: "right" }}
                    control={
                        <Switch
                            checked={showAllRequest}
                            onChange={handleRequestFilterChange}
                            name="requestFilter"
                            color="primary"
                        />
                    }
                    label="Show All Requests"
                />
            </div>

            <TableView
                data={data?.requests || []}
                onUpdateRequest={onUpdateRequest}
                showAllRequest={showAllRequest}
                onRequestFilterChange={handleRequestFilterChange}
                loading={loading}
                emptyDataMessage={t("noResults")}
            />
        </Paper>
    );
}
export default withErrorAnnouncer(Listing);
