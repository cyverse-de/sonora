import React, { useState } from "react";

import messages from "../messages";
import GridLabelValue from "../../utils/GridLabelValue";
import ids from "../ids";

import {
    build,
    formatDate,
    formatMessage,
    getMessage,
    Rate,
    withI18N,
} from "@cyverse-de/ui-lib";

import { CircularProgress, Grid } from "@material-ui/core";
import GridLoading from "../../utils/GridLoading";
import ErrorTypography from "../../utils/error/ErrorTypography";
import DEErrorDialog from "../../utils/error/DEErrorDialog";
import { injectIntl } from "react-intl";

/**
 * @author sriram
 *
 * A panel that displays app details
 */

function DetailsPanel(props) {
    const {
        app,
        details,
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
        intl,
    } = props;

    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    if (detailsLoadingStatus) {
        return <GridLoading baseId={baseId} rows={10} />;
    }

    const { user: userRating } = app.rating;

    let errorMessage;
    if (detailsError) {
        errorMessage = formatMessage(intl, "appDetailsError");
    } else if (favMutationError) {
        errorMessage = formatMessage(intl, "favMutationError");
    } else if (ratingMutationError) {
        errorMessage = formatMessage(intl, "ratingMutationError");
    }

    return (
        <>
            {(detailsError || favMutationError || ratingMutationError) && (
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
                            {getMessage("details")}
                        </Grid>
                        {!isExternal && isPublic && (
                            <GridLabelValue label={getMessage("yourRating")}>
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
                        <GridLabelValue label={getMessage("publishedOn")}>
                            {formatDate(details.integration_date)}
                        </GridLabelValue>
                        <GridLabelValue label={getMessage("integratorName")}>
                            {details.integrator_name}
                        </GridLabelValue>
                        <GridLabelValue label={getMessage("integratorEmail")}>
                            {details.integrator_email}
                        </GridLabelValue>
                        <GridLabelValue label={getMessage("analysesCompleted")}>
                            {details.job_stats.job_count_completed || 0}
                        </GridLabelValue>
                        <GridLabelValue
                            label={getMessage("detailsLastCompleted")}
                        >
                            {formatDate(details.job_stats.job_last_completed)}
                        </GridLabelValue>
                    </Grid>
                </>
            )}
        </>
    );
}

export default withI18N(injectIntl(DetailsPanel), messages);
