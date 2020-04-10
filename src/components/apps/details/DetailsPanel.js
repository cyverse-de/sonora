import React from "react";

import messages from "../messages";
import GridLabelValue from "../../utils/GridLabelValue";
import ids from "../ids";

import {
    build,
    formatDate,
    getMessage,
    Rate,
    withI18N,
} from "@cyverse-de/ui-lib";

import { CircularProgress, Grid } from "@material-ui/core";
import GridLoading from "../../utils/GridLoading";

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
        error,
        baseId,
        onRatingChange,
        onDeleteRatingClick,
        isPublic,
        isExternal,
    } = props;

    if (detailsLoadingStatus) {
        return <GridLoading rows={10} />;
    }

    if (error) {
        return <span>{error}</span>;
    }

    const { user: userRating } = app.rating;

    if (details) {
        const detailsBaseId = build(baseId, details.id, ids.APP_DETAILS);
        return (
            <>
                {ratingMutationStatus && <CircularProgress />}
                <Grid container spacing={3} id={detailsBaseId}>
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
                                    userRating ? onDeleteRatingClick : undefined
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
                        {details.job_stats.job_count_completed
                            ? details.job_stats.job_count_completed
                            : 0}
                    </GridLabelValue>
                    <GridLabelValue label={getMessage("detailsLastCompleted")}>
                        {formatDate(details.job_stats.job_last_completed)}
                    </GridLabelValue>
                </Grid>
            </>
        );
    } else {
        return null;
    }
}

export default withI18N(DetailsPanel, messages);
