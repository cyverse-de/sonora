import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import { formatDistance, fromUnixTime } from "date-fns";
import classnames from "classnames";

import {
    getLastTenNotifications,
    NOTIFICATIONS_LAST_TEN_KEY,
} from "serviceFacades/notifications";
import { useTranslation } from "../../i18n";
import ids from "./ids";
import NotificationStyles from "./styles";

import NavigationConstants from "common/NavigationConstants";

import { getDisplayMessage } from "components/layout/Notifications";

import ExternalLink from "components/utils/ExternalLink";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    makeStyles,
    Menu,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

const useStyles = makeStyles(NotificationStyles);

function getTimeStamp(time) {
    if (time) {
        // slicing because time has extra zeroes in the unix string
        const d = fromUnixTime(time.slice(0, -3));
        return formatDistance(d, new Date());
    }
}

const NotificationsListingButton = React.forwardRef((props, ref) => {
    const { isMobile, handleClose, href, onClick } = props;
    const { t } = useTranslation("common");
    const buttonId = build(
        ids.BASE_DEBUG_ID,
        ids.NOTIFICATIONS_MENU,
        ids.VIEW_ALL_NOTIFICATIONS
    );

    return isMobile ? (
        <IconButton
            className={useStyles().viewAll}
            id={buttonId}
            ref={ref}
            href={href}
            onClick={(event) => {
                onClick(event);
                handleClose();
            }}
        >
            <OpenInNewIcon size="small" />
        </IconButton>
    ) : (
        <Button
            id={buttonId}
            color="primary"
            startIcon={<OpenInNewIcon size="small" />}
            ref={ref}
            href={href}
            onClick={(event) => {
                onClick(event);
                handleClose();
            }}
        >
            {t("viewAllNotifications")}
        </Button>
    );
});

function NotificationsListingLink(props) {
    const href = `/${NavigationConstants.NOTIFICATIONS}`;

    return (
        <Link href={href} as={href} passHref>
            <NotificationsListingButton {...props} />
        </Link>
    );
}

function InteractiveAnalysisUrl(props) {
    const { t } = useTranslation(["common"]);
    return (
        <span>
            {". "}
            <ExternalLink href={props.notification.payload.access_url}>
                {t("interactiveAnalysisUrl")}
            </ExternalLink>
        </span>
    );
}

function NotificationsMenu(props) {
    const { setUnSeenCount, notificationMssg, setAnchorEl, anchorEl } = props;
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState();
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("common");

    const handleClose = () => {
        setAnchorEl();
    };

    const handleClick = () => {
        // set unseen count to 0 (I'll finish this after Paul has merged his part)
        setAnchorEl();
    };

    useEffect(() => {
        const found = notifications?.find(
            (msg) => msg.message.id === notificationMssg?.message.id
        );
        if ((found === null || found === undefined) && notificationMssg) {
            setNotifications([notificationMssg, ...notifications].slice(0, 10));
        }
    }, [notifications, notificationMssg]);

    const { isFetching } = useQuery({
        queryKey: NOTIFICATIONS_LAST_TEN_KEY,
        queryFn: getLastTenNotifications,
        config: {
            onSuccess: (results) => {
                setNotifications(results?.messages.reverse().slice(0, 10));
                if (results?.unseen_total > 0) {
                    setUnSeenCount(results?.unseen_total);
                }
                setError(null);
            },
            onError: setError,
            retry: 3,
        },
    });

    return (
        <Menu
            anchorEl={anchorEl}
            id={build(ids.BASE_DEBUG_ID, ids.NOTIFICATIONS_MENU)}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <div>
                <Typography
                    className={classes.header}
                    component="span"
                    id={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.NOTIFICATIONS_HEADER
                    )}
                    variant="h6"
                >
                    {t("notifications")}
                </Typography>
                {isMobile && [
                    <NotificationsListingLink
                        key={ids.VIEW_ALL_NOTIFICATIONS}
                        handleClose={handleClose}
                        isMobile={isMobile}
                    />,
                    <IconButton
                        key={ids.MARK_ALL_READ}
                        className={classes.markSeen}
                        onClick={handleClick}
                        id={build(
                            ids.BASE_DEBUG_ID,
                            ids.NOTIFICATIONS_MENU,
                            ids.MARK_ALL_READ
                        )}
                    >
                        <DoneAllIcon size="small" />
                    </IconButton>,
                ]}
                <Divider />
            </div>
            {isFetching && (
                <Skeleton variant="rect" height={400} animation="wave" />
            )}
            {!isFetching && error !== null && (
                <ListItem>
                    <ErrorTypographyWithDialog
                        errorMessage={t("notificationError", error)}
                    />
                </ListItem>
            )}

            {!isFetching &&
                error === null &&
                (notifications === null || notifications.length === 0) && (
                    <ListItem>
                        <Typography variant="body2">
                            {t("noNotifications")}
                        </Typography>
                    </ListItem>
                )}
            {!isFetching &&
                notifications.length > 0 &&
                notifications.map((n, index) => (
                    <ListItem
                        onClick={handleClose}
                        id={build(ids.BASE_DEBUG_ID, ids.NOTIFICATIONS_MENU)}
                        key={n.message.id}
                        className={
                            !n.seen
                                ? classnames(
                                      classes.notification,
                                      classes.unSeenNotificationBackground
                                  )
                                : classes.notification
                        }
                        dense={true}
                        divider={true}
                    >
                        <ListItemText
                            primary={
                                <Typography
                                    id={build(
                                        ids.BASE_DEBUG_ID,
                                        ids.NOTIFICATIONS_MENU,
                                        n?.id
                                    )}
                                    variant="subtitle2"
                                >
                                    {getDisplayMessage(n)}
                                    {n.payload.access_url && (
                                        <InteractiveAnalysisUrl
                                            notification={n}
                                        />
                                    )}
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    id={build(
                                        ids.BASE_DEBUG_ID,
                                        ids.NOTIFICATIONS_MENU,
                                        ids.TIME_STAMP
                                    )}
                                    variant="caption"
                                >
                                    {t("timestamp", {
                                        timestamp: getTimeStamp(
                                            n.message?.timestamp
                                        ),
                                    })}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            {!isMobile && [
                <Divider light key="divider" />,
                <NotificationsListingLink
                    key={ids.VIEW_ALL_NOTIFICATIONS}
                    handleClose={handleClose}
                    isMobile={isMobile}
                />,
                <Button
                    key={ids.MARK_ALL_READ}
                    id={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.MARK_ALL_READ
                    )}
                    color="primary"
                    onClick={handleClick}
                    startIcon={<DoneAllIcon size="small" />}
                >
                    {t("markAsRead")}
                </Button>,
            ]}
        </Menu>
    );
}

export default NotificationsMenu;
