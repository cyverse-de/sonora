/**
 * @author psarando
 *
 * The App Launch Wizard header that displays the app name and description.
 */
import React from "react";
import { useTranslation } from "i18n";

import styles from "./styles";

import { intercomShow } from "common/intercom";

import DEErrorDialog from "components/utils/error/DEErrorDialog";
import ErrorTypography from "components/utils/error/ErrorTypography";

import ids from "./ids";

import { build as buildDebugId } from "@cyverse-de/ui-lib";

import {
    Box,
    Hidden,
    Link,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(styles);

const LoadingErrorDisplay = ({ baseId, loadingError }) => {
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
    const { t } = useTranslation("launch");
    return (
        <>
            <ErrorTypography
                errorMessage={loadingError.message || t("appLoadingError")}
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
};

const AppInfo = React.forwardRef((props, ref) => {
    const { app, baseId, hasDeprecatedParams, loading, loadingError } = props;
    const unavailableMsgKey = app?.deleted
        ? "appDeprecated"
        : app?.disabled
        ? "appUnavailable"
        : hasDeprecatedParams
        ? "appParamsDeprecated"
        : null;
    const { t } = useTranslation("launch");
    const {t: i18Common} = useTranslation("common");
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <div ref={ref}>
            <Typography
                variant={isMobile ? "subtitle2" : "h6"}
                className={classes.appInfoTypography}
            >
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
            <Hidden xsDown>
                <Typography
                    className={classes.appInfoTypography}
                    variant="body2"
                    display="block"
                    gutterBottom
                >
                    {loading ? <Skeleton /> : app?.description}
                </Typography>
            </Hidden>
            <Box m={2}>
                {(app?.deleted || app?.disabled || hasDeprecatedParams) && (
                    <>
                    <Typography color="error" variant="body1" gutterBottom component="span">
                        {t(unavailableMsgKey)}
                    </Typography>
                    <Link
                            id={buildDebugId(
                                baseId,
                                ids.BUTTONS.CONTACT_SUPPORT
                            )}
                            component="button"
                            onClick={intercomShow}
                        >
                            {i18Common("contactSupport")}.
                        </Link>
                    </>
                )}
            </Box>
        </div>
    );
});

export default AppInfo;
