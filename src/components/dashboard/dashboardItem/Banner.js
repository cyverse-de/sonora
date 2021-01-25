/**
 * @author sriram
 *
 * A banner to display for logged out users.
 *
 */
import React from "react";
import Image from "next/image";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";

import NavigationConstants from "common/NavigationConstants";

import {
    Button,
    Paper,
    Grid,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import constants from "../../../constants";

export default function Banner(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("dashboard");
    const router = useRouter();

    const onLoginClick = (event) => {
        router.push(`/${NavigationConstants.LOGIN}${router.asPath}`);
    };

    const onSignUpClick = () => {
        window.open(constants.CYVERSE_USER_PORTAL, "_blank");
    };

    const onLearnMoreClick = () => {
        window.open(constants.CYVERSE_URL, "_blank");
    };

    const onGettingStartedClick = () => {
        window.open(constants.GETTING_STARTED, "_blank");
    };

    return (
        <Paper style={{ padding: theme.spacing(1) }}>
            <Grid
                container
                direction={isMobile ? "column" : "row"}
                justify="space-between"
                alignItems="center"
                spacing={isMobile ? 1 : 3}
            >
                <Grid item xs={isMobile ? 12 : 6}>
                    <Image
                        src="/science-banner.png"
                        alt="banner"
                        height={400}
                        width={800}
                    />
                </Grid>
                <Grid item xs={isMobile ? 12 : 6}>
                    <Grid
                        container
                        direction="column"
                        justify="space-between"
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
                            <Button color="primary" size="small">
                                <Typography
                                    variant={isMobile ? "caption" : "subtitle2"}
                                    onClick={onLearnMoreClick}
                                >
                                    {t("learnMore")}
                                </Typography>
                            </Button>
                            <Button
                                color="primary"
                                size="small"
                                onClick={onGettingStartedClick}
                            >
                                <Typography
                                    variant={isMobile ? "caption" : "subtitle2"}
                                >
                                    {t("gettingStarted")}
                                </Typography>
                            </Button>
                            <Button
                                color="primary"
                                size="small"
                                onClick={onLoginClick}
                            >
                                <Typography
                                    variant={isMobile ? "caption" : "subtitle2"}
                                >
                                    {t("login")}
                                </Typography>
                            </Button>
                            <Button
                                color="primary"
                                size="small"
                                onClick={onSignUpClick}
                            >
                                <Typography
                                    variant={isMobile ? "caption" : "subtitle2"}
                                >
                                    {t("signUp")}
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
