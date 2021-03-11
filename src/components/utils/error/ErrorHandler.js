/**
 * @author sriram
 *
 * A component that displays formatted error message with options to contact support or login
 */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import { intercomShow } from "../../../common/intercom";
import NavigationConstants from "../../../common/NavigationConstants";
import GridLabelValue from "../GridLabelValue";
import { useUserProfile } from "../../../contexts/userProfile";
import constants from "../../../constants";
import GridLoading from "../GridLoading";

import { build } from "@cyverse-de/ui-lib";
import ids from "../ids";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Link,
    makeStyles,
    Typography,
} from "@material-ui/core";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import ErrorIcon from "@material-ui/icons/Error";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

const useStyles = makeStyles((theme) => ({
    cardContent: {
        padding: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(1),
        },
    },
    container: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0),
        },
    },
    signIn: {
        padding: theme.spacing(1),
    },
    link: {
        cursor: "pointer",
    },
}));

function ClientInfo(props) {
    const [browser, setBrowser] = useState();
    const { t } = useTranslation("util");
    useEffect(() => {
        const doSetBrowser = async () => {
            const Bowser = (await import("bowser")).default;
            setBrowser(Bowser.getParser(window.navigator.userAgent));
        };
        doSetBrowser();
    }, []);
    const { baseId } = props;
    const [userProfile] = useUserProfile();
    if (!browser) {
        return <GridLoading rows={5} />;
    }
    return (
        <>
            <GridLabelValue label={t("user")}>
                <Typography id={build(baseId, ids.USER)}>
                    {userProfile?.id}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("browser")}>
                <Typography id={build(baseId, ids.BROWSER)}>
                    {browser.getBrowser().name} - {browser.getBrowser().version}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("os")}>
                <Typography id={build(baseId, ids.OS)}>
                    {browser.getOS().name} - {browser.getOS().versionName} -
                    {browser.getOS().version}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("host")}>
                <Typography
                    id={build(baseId, ids.host)}
                    className={constants.CHROMATIC_IGNORE}
                >
                    {window.location.origin}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("timestamp")}>
                <Typography
                    id={build(baseId, ids.host)}
                    className={constants.CHROMATIC_IGNORE}
                >
                    {new Date().toString()}
                </Typography>
            </GridLabelValue>
        </>
    );
}

function ContactSupport(props) {
    const { baseId } = props;
    const { t } = useTranslation("util");
    return (
        <Button
            id={build(baseId, ids.CONTACT_SUPPORT_BUTTON)}
            color="primary"
            startIcon={<LiveHelpIcon />}
            onClick={intercomShow}
            style={{ marginLeft: "auto" }}
        >
            {t("contactSupport")}
        </Button>
    );
}

function ErrorHandler(props) {
    const { errorObject, baseId } = props;
    const { t } = useTranslation("util");
    const router = useRouter();
    const classes = useStyles();
    const errBaseId = build(baseId, ids.ERROR_HANDLER);

    trackIntercomEvent(IntercomEvents.ENCOUNTERED_ERROR, errorObject);

    let title, subHeader, contents, avatar;

    if (!errorObject?.response && !errorObject?.config) {
        avatar = <ErrorIcon fontSize="large" color="error" />;
        title = (
            <Typography color="error" variant="h6">
                {t("oops")}
            </Typography>
        );
        subHeader = (
            <Typography color="error">{t("unexpectedError")}</Typography>
        );

        contents = (
            <Grid container spacing={2} className={classes.container}>
                <ClientInfo baseId={baseId} />
            </Grid>
        );
    } else {
        const errorResponse = errorObject.response;
        if (errorResponse?.status === 401) {
            avatar = <ErrorIcon color="primary" fontSize="large" />;
            title = (
                <Typography component="span" variant="h6">
                    {t("signInReqd")}
                </Typography>
            );
            contents = (
                <>
                    <Typography className={classes.signIn}>
                        {t("signInPrompt")}
                        <Link
                            component="button"
                            className={classes.link}
                            id={build(errBaseId, ids.SIGN_IN_LINK)}
                            color="primary"
                            onClick={() => {
                                router.push(
                                    `/${NavigationConstants.LOGIN}${router.asPath}`
                                );
                            }}
                        >
                            <Typography variant="h6" className={classes.signIn}>
                                {t("signIn")}
                            </Typography>
                        </Link>
                    </Typography>
                    <Typography className={classes.signIn}>
                        {t("needAccount")}

                        <Link
                            className={classes.link}
                            component="button"
                            id={build(errBaseId, ids.REGISTER_LINK)}
                            color="primary"
                            onClick={() => {
                                window.open(constants.USER_PORTAL);
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                className={classes.signIn}
                            >
                                {t("register")}
                            </Typography>
                        </Link>
                    </Typography>
                </>
            );
        } else if (errorResponse?.status === 403) {
            avatar = <SupervisorAccountIcon color="primary" fontSize="large" />;
            title = (
                <Typography component="span" variant="h6">
                    {t("notAuthorized")}
                </Typography>
            );
            contents = (
                <>
                    <Typography className={classes.signIn}>
                        {t("forbiddenMsg")}
                    </Typography>
                </>
            );
        } else {
            avatar = <ErrorIcon fontSize="large" color="error" />;
            title = (
                <Typography color="error" variant="h6">
                    {t("error")}
                </Typography>
            );
            subHeader = (
                <Typography color="error" variant="subtitle2">
                    {errorObject.message}
                </Typography>
            );
            contents = (
                <Grid container spacing={2} className={classes.container}>
                    <GridLabelValue label={t("requestedURL")}>
                        <Typography id={build(errBaseId, ids.REQUESTED_URL)}>
                            {errorObject.config?.method}{" "}
                            {errorObject.config?.url}
                        </Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("statusCode")}>
                        <Typography id={build(errBaseId, ids.STATUS_CODE)}>
                            {errorResponse?.status}
                        </Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("errorCode")}>
                        <Typography id={build(errBaseId, ids.ERROR_CODE)}>
                            {errorResponse?.data?.error_code}
                        </Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("reason")}>
                        <Typography id={build(errBaseId, ids.REASON)}>
                            {JSON.stringify(
                                errorResponse?.data?.reason ||
                                    errorResponse?.data?.message ||
                                    errorResponse?.data?.grouper_result_message
                            )}
                        </Typography>
                    </GridLabelValue>
                    <ClientInfo />
                </Grid>
            );
        }
    }
    return (
        <Card id={errBaseId}>
            <CardHeader avatar={avatar} title={title} subheader={subHeader} />
            <Divider orientation="horizontal" />
            <CardContent className={classes.cardContent}>
                {contents}
            </CardContent>
            <Divider orientation="horizontal" />
            <CardActions>
                <ContactSupport baseId={errBaseId} />
            </CardActions>
        </Card>
    );
}

export default ErrorHandler;
