import React from "react";

import messages from "../messages";
import GridLabelValue from "../../utils/GridLabelValue";
import constants from "../../../constants";

import {
    formatDate,
    formatMessage,
    getMessage,
    Highlighter,
    Rate,
    withI18N,
} from "@cyverse-de/ui-lib";
import { useTheme } from "@material-ui/core/styles";
import UnFavoriteIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { injectIntl } from "react-intl";

import {
    Grid,
    IconButton,
    Paper,
    Tooltip,
    Typography,
} from "@material-ui/core";
import GridLoading from "../../utils/GridLoading";

/**
 * @author sriram
 *
 * A panel that displays app details
 */

function Favorite(props) {
    const { is_favorite } = props.details;
    const { isExternal, onFavoriteClick, intl } = props;
    const theme = useTheme();

    if (is_favorite) {
        return (
            <Tooltip title={formatMessage(intl, "removeFromFavorites")}>
                <IconButton
                    onClick={() => onFavoriteClick(isExternal)}
                    disabled={isExternal}
                >
                    <FavoriteIcon style={{ color: theme.palette.primary }} />
                </IconButton>
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title={formatMessage(intl, "addToFavorites")}>
                <IconButton
                    onClick={() => onFavoriteClick(isExternal)}
                    disabled={isExternal}
                >
                    <UnFavoriteIcon style={{ color: theme.palette.primary }} />
                </IconButton>
            </Tooltip>
        );
    }
}

function DetailsPanel(props) {
    const { app, details, loading, error, searchText, baseId, intl } = props;
    const {
        average: averageRating,
        user: userRating,
        total: totalRating,
    } = app.rating;

    const isExternal =
        app.app_type.toUpperCase() ===
        constants.EXTERNAL_APP_TYPE.toUpperCase();

    if (loading) {
        return <GridLoading rows={10} />;
    }

    if (details) {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Favorite
                        intl={intl}
                        baseId={baseId}
                        details={details}
                        isExternal={isExternal}
                    />
                </Grid>
                <Grid item xs={12}>
                    {details.description}
                </Grid>
                <Grid item xs={12}>
                    {getMessage("details")}
                </Grid>
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
                <GridLabelValue label={getMessage("detailsRatingLbl")}>
                    <Rate
                        name={details.id}
                        value={userRating || averageRating}
                        readOnly={isExternal || !details.is_public}
                        total={totalRating}
                    />
                </GridLabelValue>
            </Grid>
        );
    } else {
        return null;
    }
}

export default withI18N(injectIntl(DetailsPanel), messages);
