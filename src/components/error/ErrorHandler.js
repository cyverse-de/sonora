/**
 * @author sriram
 *
 * A component that displays formatted error message with options to contact support or login
 */
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import NavigationConstants from "../../common/NavigationConstants";
import GridLabelValue from "../utils/GridLabelValue";
import constants from "../../constants";
import ClientInfo from "./ClientInfo";
import ContactSupport from "./ContactSupport";

import buildID from "components/utils/DebugIDUtil";
import ids from "../utils/ids";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

const useStyles = makeStyles((theme) => ({
    cardContent: {
        padding: theme.spacing(2),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
        },
    },
    container: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
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

function ErrorHandler(props) {
    const { errorObject, baseId } = props;
    const { t } = useTranslation("util");
    const router = useRouter();
    const classes = useStyles();
    const errBaseId = buildID(baseId, ids.ERROR_HANDLER);

    useEffect(() => {
        trackIntercomEvent(IntercomEvents.ENCOUNTERED_ERROR, errorObject);
    }, [errorObject]);

    let title,
        subHeader,
        contents,
        avatar = <ErrorIcon fontSize="large" color="error" />;

    if (!errorObject?.response && !errorObject?.config) {
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
        const errorData = errorResponse?.data;

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
                            id={buildID(errBaseId, ids.SIGN_IN_LINK)}
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
                            id={buildID(errBaseId, ids.REGISTER_LINK)}
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
        } else if (errorResponse?.status === 409) {
            avatar = <WarningIcon color="error" fontSize="large" />;
            title = (
                <Typography color="error" variant="h6">
                    {t("conflict")}
                </Typography>
            );
            subHeader = (
                <Typography color="error" variant="subtitle2">
                    {errorObject.message}
                </Typography>
            );
            contents = (
                <>
                    <Typography gutterBottom>{t("conflictErrMsg")}</Typography>
                    {errorData?.paths ? (
                        <TextField
                            id={buildID(errBaseId, ids.CONFLICTING_PATHS)}
                            label={t("conflictingPaths")}
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                            value={errorData.paths.join("\n")}
                        />
                    ) : (
                        <Typography id={buildID(errBaseId, ids.REASON)}>
                            {JSON.stringify(
                                errorData?.reason || errorData?.message
                            )}
                        </Typography>
                    )}
                </>
            );
        } else {
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
                        <Typography id={buildID(errBaseId, ids.REQUESTED_URL)}>
                            {errorObject.config?.method}{" "}
                            {errorObject.config?.url}
                        </Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("statusCode")}>
                        <Typography id={buildID(errBaseId, ids.STATUS_CODE)}>
                            {errorResponse?.status}
                        </Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("errorCode")}>
                        <Typography id={buildID(errBaseId, ids.ERROR_CODE)}>
                            {errorData?.error_code}
                        </Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("reason")}>
                        <Typography id={buildID(errBaseId, ids.REASON)}>
                            {JSON.stringify(
                                errorData?.reason ||
                                    errorData?.message ||
                                    errorData?.grouper_result_message
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
