/**
 * Toolbar for notification window.
 *
 *  @author sriram, psarando
 * */
import React from "react";

import ids from "./ids";
import styles from "./styles";

import notificationCategory from "components/models/notificationCategory";

import { useTranslation } from "i18n";

import { build } from "@cyverse-de/ui-lib";

import {
    Button,
    Hidden,
    MenuItem,
    TextField,
    Toolbar,
    makeStyles,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles(styles);

const NotificationToolbar = (props) => {
    const {
        baseDebugId,
        filter,
        onFilterChange,
        markAsSeenEnabled,
        onMarkSeenClicked,
        deleteEnabled,
        onDeleteClicked,
    } = props;

    const classes = useStyles();

    const { t } = useTranslation(["notifications", "common"]);
    const baseId = build(baseDebugId, ids.TOOLBAR);

    return (
        <Toolbar variant="dense">
            <TextField
                id={build(baseId, ids.NOTIFICATION_FILTER)}
                label={t("common:filter")}
                className={classes.filter}
                variant="outlined"
                select
                value={filter}
                onChange={onFilterChange}
            >
                {[
                    notificationCategory.new,
                    notificationCategory.all,
                    notificationCategory.analysis,
                    notificationCategory.data,
                    notificationCategory.tool_request,
                    notificationCategory.apps,
                    notificationCategory.permanent_id_request,
                    notificationCategory.team,
                ].map((category) => (
                    <MenuItem key={category} value={category}>
                        {category}
                    </MenuItem>
                ))}
            </TextField>

            <div className={classes.divider} />

            {markAsSeenEnabled && (
                <Button
                    id={build(baseId, ids.MARK_ALL_SEEN_BTN)}
                    variant="outlined"
                    size="small"
                    className={classes.toolbarButton}
                    onClick={onMarkSeenClicked}
                >
                    <CheckIcon color="primary" />
                    <Hidden xsDown>{t("markSeen")}</Hidden>
                </Button>
            )}
            {deleteEnabled && (
                <Button
                    id={build(baseId, ids.DELETE_BTN)}
                    variant="outlined"
                    size="small"
                    onClick={onDeleteClicked}
                    className={classes.toolbarButton}
                >
                    <DeleteIcon color="primary" />
                    <Hidden xsDown>{t("common:delete")}</Hidden>
                </Button>
            )}
        </Toolbar>
    );
};

export default NotificationToolbar;
