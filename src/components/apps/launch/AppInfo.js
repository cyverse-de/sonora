/**
 * @author psarando
 *
 * The App Launch Wizard header that displays the app name and description.
 */
import React from "react";
import { injectIntl } from "react-intl";

import styles from "./styles";

import { intercomShow } from "../../../common/intercom";

import DEErrorDialog from "../../utils/error/DEErrorDialog";
import ErrorTypography from "../../utils/error/ErrorTypography";

import ids from "./ids";

import {
    build as buildDebugId,
    getMessage,
    formatMessage,
} from "@cyverse-de/ui-lib";

import { Box, Link, makeStyles, Paper, Typography } from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(styles);

const LoadingErrorDisplay = injectIntl(({ intl, baseId, loadingError }) => {
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

    return (
        <>
            <ErrorTypography
                errorMessage={
                    loadingError.message ||
                    formatMessage(intl, "appLoadingError")
                }
                onDetailsClick={() => setErrorDialogOpen(true)}
            />
            <DEErrorDialog
                open={errorDialogOpen}
                baseId={baseId}
                errorObject={loadingError}
                handleClose={() => {
                    setErrorDialogOpen(false);
                }}
            />
        </>
    );
});

const AppInfo = ({
    app,
    baseId,
    hasDeprecatedParams,
    loading,
    loadingError,
}) => {
    const unavailableMsgKey = app?.deleted
        ? "appDeprecated"
        : app?.disabled
        ? "appUnavailable"
        : hasDeprecatedParams
        ? "appParamsDeprecated"
        : null;
    const classes = useStyles();
    return (
        <>
            <Paper className={classes.appInfoContainer} elevation={0}>
                <Typography variant="h6" className={classes.appInfoTypography}>
                    {loadingError ? (
                        <LoadingErrorDisplay
                            baseId={baseId}
                            loadingError={loadingError}
                        />
                    ) : loading ? (
                        <Skeleton width={250} />
                    ) : (
                        app?.name
                    )}
                </Typography>
                <Typography
                    variant="body2"
                    gutterBottom
                    className={classes.appInfoTypography}
                >
                    {loading ? <Skeleton /> : app?.description}
                </Typography>
            </Paper>
            <Box m={2}>
                {(app?.deleted || app?.disabled || hasDeprecatedParams) && (
                    <Typography color="error" variant="body1" gutterBottom>
                        {getMessage(unavailableMsgKey, {
                            values: {
                                support: (...chunks) => (
                                    <Link
                                        id={buildDebugId(
                                            baseId,
                                            ids.BUTTONS.CONTACT_SUPPORT
                                        )}
                                        component="button"
                                        variant="body1"
                                        onClick={intercomShow}
                                    >
                                        {chunks}
                                    </Link>
                                ),
                            },
                        })}
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default AppInfo;
