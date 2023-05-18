/**
 * @author sboleyn
 *
 * A component that displays formatted error message with options to contact support
 */
import React, { useEffect } from "react";
import { useTranslation } from "i18n";

import GridLabelValue from "../../utils/GridLabelValue";
import ClientInfo from "../../error/ClientInfo";
import ContactSupport from "../../error/ContactSupport";

import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";

import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
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
}));

function SubscriptionErrorHandler(props) {
    const { errorObject, baseId } = props;
    const { t } = useTranslation("subscriptions");
    const classes = useStyles();
    const errBaseId = buildID(baseId, ids.ERROR_HANDLER);

    useEffect(() => {
        trackIntercomEvent(IntercomEvents.ENCOUNTERED_ERROR, errorObject);
    }, [errorObject]);

    let title,
        contents,
        newSubscriptionStatus,
        selectedUser,
        avatar = <ErrorIcon fontSize="large" color="error" />;

    title = (
        <Typography component="span" variant="h6">
            {errorObject.failure_reason}
        </Typography>
    );

    selectedUser = errorObject?.user.username;
    newSubscriptionStatus = errorObject?.new_subscription
        ? t("true")
        : t("false");
    contents = (
        <Grid container spacing={2} className={classes.container}>
            <GridLabelValue label={t("selectedUser")}>
                <Typography id={buildID(errBaseId, ids.SELECTED_USER)}>
                    {selectedUser}
                </Typography>
            </GridLabelValue>
            <GridLabelValue label={t("newSubscriptionStatus")}>
                <Typography
                    id={buildID(errBaseId, ids.NEW_SUBSCRIPTION_STATUS)}
                >
                    {newSubscriptionStatus}
                </Typography>
            </GridLabelValue>
            <ClientInfo />
        </Grid>
    );

    return (
        <Card id={errBaseId}>
            <CardHeader avatar={avatar} title={title} />
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

export default SubscriptionErrorHandler;
