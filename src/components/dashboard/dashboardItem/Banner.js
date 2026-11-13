/**
 * @author sriram
 *
 * A banner to display for logged out users.
 *
 */
import React from "react";
import getConfig from "next/config";
import Image from "next/image";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";
import { useConfig } from "contexts/config";

import NavigationConstants from "common/NavigationConstants";

import {
    Paper,
    Grid,
    Typography,
    useTheme,
    useMediaQuery,
    Link,
} from "@mui/material";
import constants from "../../../constants";
import ExternalLink from "components/utils/ExternalLink";

export default function Banner(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { t } = useTranslation("dashboard");
    const router = useRouter();
    const [config] = useConfig();

    const cyverse_url = config?.cyverseURL;

    // Read straight from the runtime config rather than the config context:
    // the context is populated from an effect in _app, so it is still null
    // when this banner first renders and the link would point at the default.
    const { publicRuntimeConfig = {} } = getConfig() || {};
    const userPortalURL =
        publicRuntimeConfig.USER_PORTAL_URL ||
        constants.DEFAULT_USER_PORTAL_URL;

    const onLoginClick = (event) => {
        router.push(`/${NavigationConstants.LOGIN}${router.asPath}`);
    };

    return (
        <Paper>
            <Grid
                container
                direction={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems="center"
                spacing={isMobile ? 1 : 3}
            >
                <Grid size={isMobile ? 12 : 6}>
                    <Image
                        src="/scienceBanner.svg"
                        alt={t("banner")}
                        priority
                        height={400}
                        width={800}
                        loading="eager"
                        sizes="100vw"
                        style={{
                            width: "100%",
                            height: "auto",
                        }}
                    />
                </Grid>
                <Grid size={isMobile ? 12 : 6}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={isMobile ? 1 : 3}
                    >
                        <Grid size={12}>
                            <Typography
                                variant={isMobile ? "subtitle2" : "h6"}
                                color="primary"
                            >
                                {t("welcome")}
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography
                                variant={isMobile ? "caption" : "subtitle2"}
                            >
                                {t("loginSignUp")}
                            </Typography>
                        </Grid>
                        <Grid size={12}>
                            <ExternalLink
                                color="primary"
                                style={{
                                    margin: theme.spacing(0.4),
                                }}
                                href={cyverse_url}
                            >
                                {t("learnMore")} |
                            </ExternalLink>
                            <ExternalLink
                                color="primary"
                                style={{
                                    margin: theme.spacing(0.4),
                                }}
                                href={constants.GETTING_STARTED}
                            >
                                {t("gettingStarted")} |
                            </ExternalLink>

                            <ExternalLink
                                color="primary"
                                style={{
                                    margin: theme.spacing(0.4),
                                }}
                                href={userPortalURL}
                            >
                                {t("signUp")} |
                            </ExternalLink>
                            <Link
                                href="#"
                                color="primary"
                                onClick={onLoginClick}
                                style={{
                                    margin: theme.spacing(0.4),
                                }}
                                underline="hover"
                            >
                                {t("login")}
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
