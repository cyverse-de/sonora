import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { formatDistance, fromUnixTime } from "date-fns";

import {
    getLastTenNotifications,
    NOTIFICATIONS_LAST_TEN_KEY,
} from "serviceFacades/notifications";
import { useTranslation } from "../../i18n";
import ids from "./ids";
import NotificationStyles from "./styles";
import { getDisplayMessage } from "components/layout/Notifications";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    Divider,
    IconButton,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
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

function NotificationsMenu(props) {
    const { setUnSeenCount, notificationMssg, setAnchorEl, anchorEl } = props;
    const [notifications, setNotifications] = useState([]);
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation(["common"]);

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
                setNotifications(results?.messages.reverse());
                setUnSeenCount(results?.unseen_total);
            },
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
                    <IconButton
                        className={classes.viewAll}
                        onClick={handleClose}
                    >
                        <OpenInNewIcon size="small" />
                    </IconButton>,
                    <IconButton
                        className={classes.markSeen}
                        onClick={handleClick}
                    >
                        <DoneAllIcon size="small" />
                    </IconButton>,
                ]}
                <Divider />
            </div>
            {isFetching && <Skeleton variant="rect" height={400} />}
            {!isFetching &&
                notifications.length > 0 &&
                notifications.map((n, index) => (
                    <MenuItem
                        onClick={handleClose}
                        id={build(ids.BASE_DEBUG_ID, "ids.NOTIFICATION_MENU")}
                        key={n.message.id}
                        className={
                            !n.seen
                                ? classes.unSeenNotificationBackground
                                : ""
                        }
                        dense
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
                                </Typography>
                            }
                            secondary={
                                <Typography
                                    className={classes.timeStamp}
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
                    </MenuItem>
                ))}

            {!isMobile && [
                <Divider light key="divider" />,
                <Button
                    key={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.VIEW_ALL_NOTIFICATIONS
                    )}
                    id={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.VIEW_ALL_NOTIFICATIONS
                    )}
                    color="primary"
                    onClick={handleClose}
                    startIcon={<OpenInNewIcon size="small" />}
                >
                    {t("viewAllNotifications")}
                </Button>,
                <Button
                    key={build(
                        ids.BASE_DEBUG_ID,
                        ids.NOTIFICATIONS_MENU,
                        ids.MARK_ALL_READ
                    )}
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
