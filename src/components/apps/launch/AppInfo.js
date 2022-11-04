/**
 * @author psarando, sriram
 *
 * The App Launch Wizard header that displays the app name and description.
 */
import React from "react";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";
import { Trans } from "react-i18next";

import styles from "./styles";

import { intercomShow } from "common/intercom";

import VersionSelection from "components/apps/VersionSelection";
import AppDocDialog from "components/apps/details/AppDoc";
import DetailsDrawer from "components/apps/details/Drawer";
import { getAppLaunchPath } from "components/apps/utils";

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

import { appUnavailable } from "../utils";

import { useConfig } from "contexts/config";
import ExternalLink from "components/utils/ExternalLink";

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

const UnavailableMsg = ({
    app,
    hasDeprecatedParams,
    computeLimitExceeded,
    baseId,
}) => {
    let message = "";
    const { t } = useTranslation("launch");
    const [config] = useConfig();

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
    } else if (computeLimitExceeded) {
        message = (
            <Trans
                t={t}
                i18nKey="computeLimitExceeded"
                components={{
                    buy: (
                        <ExternalLink
                            href={config?.subscriptions?.checkout_url}
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
    const {
        app,
        baseId,
        hasDeprecatedParams,
        computeLimitExceeded,
        loading,
        loadingError,
    } = props;

    const { t } = useTranslation("apps");
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const router = useRouter();

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
            {loading && !loadingError ? (
                <Skeleton />
            ) : (
                !loadingError &&
                app?.versions?.length > 0 && (
                    <VersionSelection
                        baseId={baseId}
                        version_id={app.deleted ? "" : app.version_id}
                        versions={app.versions}
                        FormHelperTextProps={{ error: true }}
                        helperText={
                            app.deleted
                                ? t("otherVersionsAvailable", {
                                      count: app.versions.length,
                                  })
                                : app.version_id !==
                                      app.versions[0].version_id &&
                                  t("newerVersionAvailable")
                        }
                        onChange={(versionId) =>
                            router.push(
                                getAppLaunchPath(
                                    app.system_id,
                                    app.id,
                                    versionId
                                )
                            )
                        }
                    />
                )
            )}
            <Box m={2}>
                {appUnavailable(
                    app,
                    hasDeprecatedParams,
                    computeLimitExceeded
                ) && (
                    <UnavailableMsg
                        app={app}
                        hasDeprecatedParams={hasDeprecatedParams}
                        computeLimitExceeded={computeLimitExceeded}
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
            <AppDocDialog
                open={docDialogOpen}
                appId={app?.id}
                versionId={app?.version_id}
                systemId={app?.system_id}
                name={app?.name}
                onClose={() => setDocDialogOpen(false)}
            />
        </>
    );
};

export default AppInfo;
