import React, { useState } from "react";
import { useTranslation } from "i18n";

import GridLabelValue from "components/utils/GridLabelValue";

import ids from "../ids";

import { build, formatDate, Rate } from "@cyverse-de/ui-lib";

import { CircularProgress, Grid } from "@material-ui/core";
import GridLoading from "components/utils/GridLoading";
import ErrorTypography from "components/utils/error/ErrorTypography";
import DEErrorDialog from "components/utils/error/DEErrorDialog";

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
        favMutationError,
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
    } else if (favMutationError) {
        errorMessage = t("favMutationError");
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
                        errorObject={
                            detailsError ||
                            favMutationError ||
                            ratingMutationError
                        }
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
                        id={build(baseId, details.id, ids.APP_DETAILS)}
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
                        <GridLabelValue label={t("publishedOn")}>
                            {formatDate(details.integration_date)}
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
                            {formatDate(details.job_stats?.job_last_completed)}
                        </GridLabelValue>
                    </Grid>
                </>
            )}
        </>
    );
}

export default DetailsPanel;
