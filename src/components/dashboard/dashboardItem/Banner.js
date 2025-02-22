/**
 * @author sriram
 *
 * A banner to display for logged out users.
 *
 */
import React, { useEffect, useRef } from "react";
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

    const onLoginClick = (event) => {
        router.push(`/${NavigationConstants.LOGIN}${router.asPath}`);
    };

    const userPortalURLRef = useRef(constants.DEFAULT_USER_PORTAL_URL);
    useEffect(() => {
        if (config?.userPortalURL) {
            userPortalURLRef.current = config.userPortalURL;
        }
    }, [config]);

    return (
        <Paper>
            <Grid
                container
                direction={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems="center"
                spacing={isMobile ? 1 : 3}
            >
                <Grid item xs={isMobile ? 12 : 6}>
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
                <Grid item xs={isMobile ? 12 : 6}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={isMobile ? 1 : 3}
                    >
                        <Grid item xs={12}>
                            <Typography
                                variant={isMobile ? "subtitle2" : "h6"}
                                color="primary"
                            >
                                {t("welcome")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                variant={isMobile ? "caption" : "subtitle2"}
                            >
                                {t("loginSignUp")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
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
                                href={userPortalURLRef.current}
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
