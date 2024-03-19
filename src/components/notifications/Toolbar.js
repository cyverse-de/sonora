/**
 * Toolbar for notification window.
 *
 *  @author sriram, psarando
 * */
import React from "react";

import ids from "./ids";
import styles from "./styles";

import NotificationCategory from "components/models/NotificationCategory";

import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";

import { Button, MenuItem, TextField, Toolbar } from "@mui/material";

import { makeStyles } from "tss-react/mui";

import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { Refresh } from "@mui/icons-material";
import useBreakpoints from "components/layout/useBreakpoints";

const useStyles = makeStyles()(styles);

const NotificationToolbar = (props) => {
    const {
        baseDebugId,
        filter,
        onFilterChange,
        markAsSeenEnabled,
        onMarkSeenClicked,
        deleteEnabled,
        onDeleteClicked,
        onRefreshClicked,
    } = props;

    const { classes } = useStyles();

    const { t } = useTranslation(["notifications", "common"]);
    const baseId = buildID(baseDebugId, ids.TOOLBAR);
    const filterId = buildID(baseId, ids.NOTIFICATION_FILTER);
    const { isSmDown } = useBreakpoints();

    return (
        <Toolbar variant="dense">
            <TextField
                id={filterId}
                label={t("common:filter")}
                className={classes.filter}
                variant="outlined"
                select
                size="small"
                value={filter}
                onChange={onFilterChange}
            >
                {Object.keys(NotificationCategory).map((key) => (
                    <MenuItem
                        key={key}
                        id={buildID(filterId, key)}
                        value={NotificationCategory[key]}
                    >
                        {t(key.toLowerCase())}
                    </MenuItem>
                ))}
            </TextField>

            <div className={classes.divider} />

            <Button
                id={buildID(baseId, ids.REFRESH_BTN)}
                variant="outlined"
                size="small"
                onClick={onRefreshClicked}
                className={classes.toolbarButton}
            >
                <Refresh color="primary" />
                {!isSmDown && <>{t("refresh")}</>}
            </Button>

            {markAsSeenEnabled && (
                <Button
                    id={buildID(baseId, ids.MARK_ALL_SEEN_BTN)}
                    variant="outlined"
                    size="small"
                    className={classes.toolbarButton}
                    onClick={onMarkSeenClicked}
                >
                    <CheckIcon color="primary" />
                    {!isSmDown && <>{t("markSeen")}</>}
                </Button>
            )}
            {deleteEnabled && (
                <Button
                    id={buildID(baseId, ids.DELETE_BTN)}
                    variant="outlined"
                    size="small"
                    onClick={onDeleteClicked}
                    className={classes.toolbarButton}
                >
                    <DeleteIcon color="primary" />
                    {!isSmDown && <>{t("common:delete")}</>}
                </Button>
            )}
        </Toolbar>
    );
};

export default NotificationToolbar;
