/**
 * @author psarando, sriram
 *
 * The App Launch Wizard header that displays the app name and description.
 */
import React from "react";
import { useTranslation } from "i18n";
import { Trans } from "react-i18next";

import styles from "./styles";

import { intercomShow } from "common/intercom";

import AppDoc from "components/apps/details/AppDoc";
import DetailsDrawer from "components/apps/details/Drawer";

import BackButton from "components/utils/BackButton";
import DEErrorDialog from "components/error/DEErrorDialog";
import ErrorTypography from "components/error/ErrorTypography";

import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";

import {
    Box,
    Button,
    Hidden,
    Link,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import { Info, MenuBook } from "@material-ui/icons";

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
                            id={buildID(baseId, ids.BUTTONS.CONTACT_SUPPORT)}
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
                            id={buildID(baseId, ids.BUTTONS.CONTACT_SUPPORT)}
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

const AppInfo = (props) => {
    const { app, baseId, hasDeprecatedParams, loading, loadingError } = props;
    const { t } = useTranslation("apps");
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const [detailsDrawerOpen, setDetailsDrawerOpen] = React.useState(false);
    const [docDialogOpen, setDocDialogOpen] = React.useState(false);

    return (
        <>
            <BackButton
                style={{
                    margin: isMobile ? theme.spacing(0) : theme.spacing(0.5),
                }}
            />
            <Button
                id={buildID(baseId, ids.BUTTONS.DETAILS)}
                className={classes.detailsButton}
                onClick={() => setDetailsDrawerOpen(true)}
                variant={isMobile ? "text" : "outlined"}
                size="small"
                startIcon={<Info color="primary" fontSize="small" />}
            >
                <Hidden xsDown>{t("details")}</Hidden>
            </Button>
            <Button
                id={buildID(baseId, ids.BUTTONS.DOCUMENTATION)}
                className={classes.detailsButton}
                onClick={() => setDocDialogOpen(true)}
                variant={isMobile ? "text" : "outlined"}
                size="small"
                startIcon={<MenuBook color="primary" fontSize="small" />}
            >
                <Hidden xsDown>{t("documentation")}</Hidden>
            </Button>
            {loadingError ? (
                <LoadingErrorDisplay
                    baseId={baseId}
                    loadingError={loadingError}
                />
            ) : loading ? (
                <Skeleton width={250} />
            ) : (
                <Typography
                    variant={isMobile ? "subtitle2" : "h6"}
                    className={classes.appInfoTypography}
                >
                    {app?.name}
                </Typography>
            )}
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
            <DetailsDrawer
                appId={app?.id}
                systemId={app?.system_id}
                open={detailsDrawerOpen}
                onClose={() => setDetailsDrawerOpen(false)}
            />
            <AppDoc
                open={docDialogOpen}
                appId={app?.id}
                systemId={app?.system_id}
                name={app?.name}
                onClose={() => setDocDialogOpen(false)}
            />
        </>
    );
};

export default AppInfo;
