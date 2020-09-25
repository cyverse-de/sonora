/**
 * @author psarando
 *
 * The App Launch Wizard header that displays the app name and description.
 */
import React from "react";
import { useTranslation } from "i18n";
import { Trans } from "react-i18next";
import { useRouter } from "next/router";

import styles from "./styles";

import { intercomShow } from "common/intercom";

import DetailsDrawer from "components/apps/details/Drawer";
import DEErrorDialog from "components/utils/error/DEErrorDialog";
import ErrorTypography from "components/utils/error/ErrorTypography";

import ids from "./ids";

import { build as buildDebugId } from "@cyverse-de/ui-lib";

import {
    Box,
    Button,
    Hidden,
    IconButton,
    Link,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import { ArrowBack, Info } from "@material-ui/icons";

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
const UnavailableMsg = ({ app, hasDeprecatedParams, baseId }) => {
    let message = "";
    const { t } = useTranslation("launch");
    if (app?.deleted) {
        message = (
            <Trans
                t={t}
                i18nKey="appDeprecated"
                components={{
                    support: (
                        <Link
                            id={buildDebugId(
                                baseId,
                                ids.BUTTONS.CONTACT_SUPPORT
                            )}
                            component="button"
                            onClick={intercomShow}
                        />
                    ),
                }}
            />
        );
    } else if (app?.disabled) {
        message = t("appUnavailable");
    } else if (hasDeprecatedParams) {
        message = (
            <Trans
                t={t}
                i18nKey="appParamsDeprecated"
                components={{
                    support: (
                        <Link
                            id={buildDebugId(
                                baseId,
                                ids.BUTTONS.CONTACT_SUPPORT
                            )}
                            component="button"
                            onClick={intercomShow}
                        />
                    ),
                }}
            />
        );
    }

    return (
        <Typography color="error" variant="body1" gutterBottom component="span">
            {message}
        </Typography>
    );
};
const AppInfo = React.forwardRef((props, ref) => {
    const { app, baseId, hasDeprecatedParams, loading, loadingError } = props;
    const { t } = useTranslation("common");
    const router = useRouter();
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const [open, setOpen] = React.useState(false);
    return (
        <div ref={ref}>
            <Typography
                variant={isMobile ? "subtitle2" : "h6"}
                className={classes.appInfoTypography}
            >
                <>
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        style={{ marginRight: 8 }}
                        startIcon={<ArrowBack fontSize="small" />}
                        onClick={() => router.back()}
                    >
                        {t("back")}
                    </Button>
                    {loadingError ? (
                        <LoadingErrorDisplay
                            baseId={baseId}
                            loadingError={loadingError}
                        />
                    ) : loading ? (
                        <Skeleton width={250} />
                    ) : (
                        <>
                            {app?.name}
                            <IconButton onClick={() => setOpen(true)}>
                                <Info color="primary" fontSize="small" />
                            </IconButton>
                            <DetailsDrawer
                                appId={app?.id}
                                systemId={app?.system_id}
                                open={open}
                                onClose={() => setOpen(false)}
                                baseId="launch"
                            />
                        </>
                    )}
                </>
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
                    <UnavailableMsg
                        app={app}
                        hasDeprecatedParams={hasDeprecatedParams}
                        baseId={baseId}
                    />
                )}
            </Box>
        </div>
    );
});

export default AppInfo;
