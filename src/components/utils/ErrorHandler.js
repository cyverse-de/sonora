/**
 * @author sriram
 *
 * A component that displays formatted error message with options to contact support or login
 */
import React from "react";
import Bowser from "bowser";
import { useRouter } from "next/router";
import { injectIntl } from "react-intl";

import NavigationConstants from "../../common/NavigationConstants";
import GridLabelValue from "./GridLabelValue";
import { useUserProfile } from "../../contexts/userProfile";
import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";
import messages from "./messages";
import ids from "./ids";
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

import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import ErrorIcon from "@material-ui/icons/Error";
import constants from "../../constants";

const useStyles = makeStyles((theme) => ({
    cardContent: {
        padding: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(0),
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
    const { baseId } = props;
    const browser = Bowser.getParser(window.navigator.userAgent);
    const [userProfile] = useUserProfile();
    return (
        <>
            <GridLabelValue label={getMessage("user")}>
                <Typography id={build(baseId, ids.USER)}>
                    {userProfile?.id}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={getMessage("browser")}>
                <Typography id={build(baseId, ids.BROWSER)}>
                    {browser.getBrowser().name} - {browser.getBrowser().version}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={getMessage("os")}>
                <Typography id={build(baseId, ids.OS)}>
                    {browser.getOS().name} - {browser.getOS().versionName} -
                    {browser.getOS().version}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={getMessage("host")}>
                <Typography id={build(baseId, ids.host)}>
                    {window.location.origin}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={getMessage("timestamp")}>
                <Typography id={build(baseId, ids.host)}>
                    {new Date().toString()}
                </Typography>
            </GridLabelValue>
        </>
    );
}

function ContactSupport(props) {
    const { baseId } = props;
    return (
        <Button
            id={build(baseId, ids.CONTACT_SUPPORT_BUTTON)}
            color="primary"
            startIcon={<LiveHelpIcon />}
            onClick={() => window.Intercom("show")}
        >
            {getMessage("contactSupport")}
        </Button>
    );
}

function ErrorHandler(props) {
    const { errorObject, baseId } = props;
    const router = useRouter();
    const classes = useStyles();
    const errBaseId = build(baseId, ids.ERROR_HANDLER);
    let title, subHeader, contents;

    if (!errorObject?.response) {
        title = (
            <Typography color="error" variant="h6">
                <ErrorIcon /> {getMessage("oops")}
            </Typography>
        );
        subHeader = (
            <Typography color="error">
                {getMessage("unexpectedError")}
            </Typography>
        );

        contents = (
            <Grid container spacing={2} className={classes.container}>
                <ClientInfo baseId={baseId} />
            </Grid>
        );
    } else {
        const errorResponse = errorObject.response;
        if (errorResponse?.status === 401) {
            title = (
                <Typography component="span" variant="h5">
                    <ErrorIcon color="primary" />
                    {getMessage("signInReqd")}
                </Typography>
            );
            contents = (
                <>
                    <Typography variant="h6" className={classes.signIn}>
                        <Link
                            className={classes.link}
                            id={build(errBaseId, ids.SIGN_IN_LINK)}
                            color="primary"
                            onClick={() => {
                                router.push(
                                    `/${NavigationConstants.LOGIN}${router.asPath}`
                                );
                            }}
                        >
                            {getMessage("signIn")}
                        </Link>
                    </Typography>
                    <Typography variant="subtitle2" className={classes.signIn}>
                        {getMessage("needAccount")}
                        <Link
                            className={classes.link}
                            id={build(errBaseId, ids.REGISTER_LINK)}
                            color="primary"
                            onClick={() => {
                                window.open(constants.USER_PORTAL);
                            }}
                        >
                            {getMessage("register")}
                        </Link>
                    </Typography>
                </>
            );
        } else {
            title = (
                <Typography color="error" variant="h5">
                    <ErrorIcon /> {getMessage("error")}
                </Typography>
            );
            subHeader = (
                <Typography color="error" variant="subtitle2">
                    {errorObject.message}
                </Typography>
            );
            contents = (
                <Grid container spacing={2} className={classes.container}>
                    <GridLabelValue label={getMessage("requestedURL")}>
                        <span id={build(errBaseId, ids.REQUESTED_URL)}>
                            {errorObject.config?.url}
                        </span>
                    </GridLabelValue>
                    <GridLabelValue label={getMessage("statusCode")}>
                        <span id={build(errBaseId, ids.STATUS_CODE)}>
                            {errorResponse?.status}
                        </span>
                    </GridLabelValue>
                    <GridLabelValue label={getMessage("errorCode")}>
                        <span id={build(errBaseId, ids.ERROR_CODE)}>
                            {errorResponse?.data?.error_code}
                        </span>
                    </GridLabelValue>
                    <GridLabelValue label={getMessage("reason")}>
                        <span id={build(errBaseId, ids.REASON)}>
                            {JSON.stringify(errorResponse?.data?.reason)}
                        </span>
                    </GridLabelValue>
                    <ClientInfo />
                </Grid>
            );
        }
    }
    return (
        <Card id={errBaseId}>
            <CardHeader title={title} subheader={subHeader} />
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

export default withI18N(injectIntl(ErrorHandler), messages);
