import React, { useState } from "react";
import { useTranslation } from "i18n";

import GridLoading from "components/utils/GridLoading";
import ErrorTypography from "components/error/ErrorTypography";
import DEErrorDialog from "components/error/DEErrorDialog";
import ListSavedLaunches from "components/apps/savedLaunch/SavedLaunchListing";

import GridLabelValue from "components/utils/GridLabelValue";

import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";
import { formatDateObject } from "components/utils/DateFormatter";
import Rate from "components/rating/Rate";

import { CircularProgress, Grid } from "@mui/material";

/**
 * @author sriram
 *
 * A panel that displays app details
 */

function DetailsPanel(props) {
    const {
        details,
        userRating,
        detailsLoadingStatus,
        ratingMutationStatus,
        baseId,
        onRatingChange,
        onDeleteRatingClick,
        isPublic,
        isExternal,
        detailsError,
        ratingMutationError,
    } = props;
    const { t } = useTranslation("apps");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    if (detailsLoadingStatus) {
        return <GridLoading baseId={baseId} rows={10} />;
    }

    let errorMessage;
    if (detailsError) {
        errorMessage = t("appDetailsError");
    } else if (ratingMutationError) {
        errorMessage = t("ratingMutationError");
    }

    return (
        <>
            {errorMessage && (
                <>
                    <ErrorTypography
                        errorMessage={errorMessage}
                        onDetailsClick={() => setErrorDialogOpen(true)}
                    />
                    <DEErrorDialog
                        open={errorDialogOpen}
                        baseId={baseId}
                        errorObject={detailsError || ratingMutationError}
                        handleClose={() => {
                            setErrorDialogOpen(false);
                        }}
                    />
                </>
            )}
            {details && (
                <>
                    {ratingMutationStatus && (
                        <CircularProgress size={30} thickness={5} />
                    )}
                    <Grid
                        container
                        spacing={3}
                        id={buildID(baseId, details.id, ids.APP_DETAILS)}
                    >
                        <Grid item xs={12}>
                            {details.description}
                        </Grid>
                        <Grid item xs={12}>
                            {t("details")}
                        </Grid>
                        {!isExternal && isPublic && (
                            <GridLabelValue label={t("yourRating")}>
                                <Rate
                                    name={"user." + details.id}
                                    value={userRating}
                                    readOnly={false}
                                    onChange={onRatingChange}
                                    onDelete={
                                        userRating
                                            ? onDeleteRatingClick
                                            : undefined
                                    }
                                />
                            </GridLabelValue>
                        )}
                        <GridLabelValue label={t("systemId")}>
                            {details.system_id}
                        </GridLabelValue>
                        <GridLabelValue label={t("publishedOn")}>
                            {formatDateObject(
                                details.integration_date &&
                                    new Date(details.integration_date)
                            )}
                        </GridLabelValue>
                        <GridLabelValue label={t("integratorName")}>
                            {details.integrator_name}
                        </GridLabelValue>
                        <GridLabelValue label={t("integratorEmail")}>
                            {details.integrator_email}
                        </GridLabelValue>
                        <GridLabelValue label={t("analysesCompleted")}>
                            {details.job_stats?.job_count_completed || 0}
                        </GridLabelValue>
                        <GridLabelValue label={t("detailsLastCompleted")}>
                            {formatDateObject(
                                details.job_stats?.job_last_completed &&
                                    new Date(
                                        details.job_stats.job_last_completed
                                    )
                            )}
                        </GridLabelValue>
                        <GridLabelValue
                            label={t("savedLaunch")}
                        ></GridLabelValue>
                    </Grid>
                    <ListSavedLaunches
                        appId={details.id}
                        systemId={details["system_id"]}
                        baseDebugId={baseId}
                    />
                </>
            )}
        </>
    );
}

export default DetailsPanel;
