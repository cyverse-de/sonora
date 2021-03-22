/**
 * @author sriram
 *
 * A component intended to list all VICE access requests in a table view
 * with options to approve / reject requests by admin.
 *
 */

import React from "react";
import { useQuery, queryCache, useMutation } from "react-query";
import { useTranslation } from "i18n";

import { build } from "@cyverse-de/ui-lib";

import ids from "./ids";
import {
    adminRequestListing,
    adminUpdateRequestStatus,
    ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY,
    ACCESS_REQUEST_REJECTED,
    ACCESS_REQUEST_APPROVED,
    ACCESS_REQUEST_COMPLETED,
} from "serviceFacades/vice/accessRequest";

import { setUserJobLimit } from "serviceFacades/vice/admin";

import TableView from "./TableView";
import DEDialog from "components/utils/DEDialog";

import ErrorHandler from "components/utils/error/ErrorHandler";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import {
    Button,
    FormControlLabel,
    Paper,
    Switch,
    Slider,
    TextField,
    Typography,
    useTheme,
} from "@material-ui/core";

function Listing(props) {
    const { baseId, showErrorAnnouncer } = props;
    const theme = useTheme();
    const { t } = useTranslation("vice-admin");
    const { t: i18nCommon } = useTranslation("common");
    const [data, setData] = React.useState(null);
    const [showAllRequest, setShowAllRequest] = React.useState(false);
    const [jobLimitDialogOpen, setJobLimitDialogOpen] = React.useState(false);
    const [jobLimit, setJobLimit] = React.useState(2);
    const [selectedRequest, setSelectedRequest] = React.useState();
    const [deniedMsg, setDeniedMsg] = React.useState();
    const [deniedMsgDialogOpen, setDeniedMsgDialogOpen] = React.useState(false);

    const handleRequestFilterChange = (event) => {
        setShowAllRequest(event.target.checked);
    };

    const handleSliderChange = (event, newValue) => {
        setJobLimit(parseInt(newValue, 10));
    };

    const handleDeniedMsgChange = (event) => {
        setDeniedMsg(event.target.value);
    };

    const { isFetching, error: listingError } = useQuery({
        queryKey: [ADMIN_ACCESS_REQUEST_LISTING_QUERY_KEY, { showAllRequest }],
        queryFn: adminRequestListing,
        config: {
            enabled: true,
            onSuccess: setData,
        },
    });

    const [setLimitMutation, { isLoading: limitLoading }] = useMutation(
        setUserJobLimit,
        {
            onSuccess: (resp) => {
                const msg = t("accessRequestApprovedMsg", {
                    quota: jobLimit,
                });
                updateRequest({
                    id: selectedRequest.id,
                    status: ACCESS_REQUEST_APPROVED,
                    message: msg,
                });
            },

            onError: (e) => {
                showErrorAnnouncer(t("jobLimitUpdateError", { error: e }), e);
            },
        }
    );

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

    const onUpdateRequest = (selectedRequest, status) => {
        setSelectedRequest(selectedRequest);
        if (
            status === ACCESS_REQUEST_APPROVED ||
            status === ACCESS_REQUEST_COMPLETED
        ) {
            setJobLimitDialogOpen(true);
        } else {
            setDeniedMsgDialogOpen(true);
        }
    };

    const onSetJobLimit = () => {
        setJobLimitDialogOpen(false);
        setLimitMutation({
            username: selectedRequest.requesting_user,
            newLimit: jobLimit,
        });
    };

    const onRejectRequest = () => {
        setDeniedMsgDialogOpen(false);
        updateRequest({
            id: selectedRequest.id,
            status: ACCESS_REQUEST_REJECTED,
            message: deniedMsg,
        });
    };

    const loading = isFetching || updateLoading || limitLoading;

    if (listingError) {
        return <ErrorHandler errorObject={listingError} />;
    }

    return (
        <>
            <Paper
                style={{
                    marginTop: theme.spacing(1),
                    marginBottom: theme.spacing(1),
                }}
            >
                <div style={{ padding: theme.spacing(1) }}>
                    <Typography variant="h6" component="span">
                        {t("accessRequests")}
                    </Typography>
                    <FormControlLabel
                        style={{ float: "right" }}
                        control={
                            <Switch
                                id={build(baseId, ids.SHOW_ALL_REQUESTS_SWITCH)}
                                checked={showAllRequest}
                                onChange={handleRequestFilterChange}
                                name="requestFilter"
                                color="primary"
                            />
                        }
                        label={t("showAllRequests")}
                    />
                </div>

                <TableView
                    baseId={build(baseId, ids.REQUESTS_TABLE)}
                    data={data?.requests || []}
                    onUpdateRequest={onUpdateRequest}
                    showAllRequest={showAllRequest}
                    onRequestFilterChange={handleRequestFilterChange}
                    loading={loading}
                    emptyDataMessage={t("noResults")}
                />
            </Paper>
            <DEDialog
                baseId={ids.JOB_LIMITS_DLG}
                open={jobLimitDialogOpen}
                onClose={() => setJobLimitDialogOpen(false)}
                title={t("setLimitTitle")}
                actions={
                    <>
                        <Button onClick={() => setJobLimitDialogOpen(false)}>
                            {i18nCommon("cancel")}
                        </Button>
                        <Button color="primary" onClick={onSetJobLimit}>
                            {i18nCommon("done")}
                        </Button>
                    </>
                }
                on
            >
                <Typography
                    id={build(ids.JOB_LIMITS_DLG, ids.JOB_LIMIT_SLIDER)}
                >
                    {t("setLimitPrompt", {
                        username: selectedRequest?.requesting_user,
                    })}
                </Typography>
                <Slider
                    style={{ marginTop: theme.spacing(2) }}
                    value={jobLimit}
                    onChange={handleSliderChange}
                    aria-labelledby={build(
                        ids.JOB_LIMITS_DLG,
                        ids.JOB_LIMIT_SLIDER
                    )}
                    step={1}
                    marks
                    min={1}
                    max={10}
                    valueLabelDisplay="on"
                />
            </DEDialog>
            <DEDialog
                baseId={ids.REJECT_REQUEST_DLG}
                title={t("requestDeniedTitle")}
                open={deniedMsgDialogOpen}
                onClose={() => setDeniedMsgDialogOpen(false)}
                actions={
                    <>
                        <Button onClick={() => setDeniedMsgDialogOpen(false)}>
                            {i18nCommon("cancel")}
                        </Button>
                        <Button color="primary" onClick={onRejectRequest}>
                            {i18nCommon("done")}
                        </Button>
                    </>
                }
            >
                <Typography>
                    {t("requestDeniedPrompt", {
                        username: selectedRequest?.requesting_user,
                    })}
                </Typography>
                <TextField
                    id={build(ids.REJECT_REQUEST_DLG, ids.REJECT_REQUEST_DLG)}
                    variant="outlined"
                    multiline
                    rowsMax={4}
                    value={deniedMsg}
                    onChange={handleDeniedMsgChange}
                />
            </DEDialog>
        </>
    );
}
export default withErrorAnnouncer(Listing);
