/**
 * Toolbar for notification window.
 *
 *  @author sriram, psarando
 * */
import React, { Component } from "react";

import exStyles from "./style";
import ids from "./ids";
import intlData from "./messages";

import notificationCategory from "components/models/notificationCategory";

import { build, getMessage, withI18N } from "@cyverse-de/ui-lib";

import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Select,
    Toolbar,
    withStyles,
} from "@material-ui/core";

import RefreshIcon from "@material-ui/icons/Refresh";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";

class NotificationToolbar extends Component {
    render() {
        const { classes, baseDebugId } = this.props;
        const baseId = baseDebugId + ids.TOOLBAR;
        return (
            <Toolbar className={classes.toolbar}>
                <form autoComplete="off">
                    <FormControl className={classes.dropDown}>
                        <InputLabel className={classes.dropDownLabel}>
                            {getMessage("filter")}
                        </InputLabel>
                        <Select
                            id={build(baseId, ids.NOTIFICATION_FILTER)}
                            native
                            value={this.props.filter}
                            onChange={this.props.onFilterChange}
                            input={
                                <OutlinedInput labelWidth={0} name="filter" />
                            }
                        >
                            <option value={notificationCategory.new}>
                                {notificationCategory.new}
                            </option>
                            <option value={notificationCategory.all}>
                                {notificationCategory.all}
                            </option>
                            <option value={notificationCategory.analysis}>
                                {notificationCategory.analysis}
                            </option>
                            <option value={notificationCategory.data}>
                                {notificationCategory.data}
                            </option>
                            <option value={notificationCategory.tool_request}>
                                {notificationCategory.tool_request}
                            </option>
                            <option value={notificationCategory.apps}>
                                {notificationCategory.apps}
                            </option>
                            <option
                                value={
                                    notificationCategory.permanent_id_request
                                }
                            >
                                {notificationCategory.permanent_id_request}
                            </option>
                            <option value={notificationCategory.team}>
                                {notificationCategory.team}
                            </option>
                        </Select>
                    </FormControl>
                </form>

                <Button
                    id={build(baseId, ids.REFRESH_BTN)}
                    variant="contained"
                    size="small"
                    className={classes.toolbarButton}
                    onClick={this.props.onRefreshClicked}
                >
                    <RefreshIcon color="primary" />
                    {getMessage("refresh")}
                </Button>
                <Button
                    id={build(baseId, ids.MARK_ALL_SEEN_BTN)}
                    variant="contained"
                    size="small"
                    disabled={this.props.markSeenDisabled}
                    className={classes.toolbarButton}
                    onClick={this.props.onMarkSeenClicked}
                >
                    <CheckIcon color="primary" />
                    {getMessage("markSeen")}
                </Button>
                <Button
                    id={build(baseId, ids.DELETE_BTN)}
                    variant="contained"
                    size="small"
                    disabled={this.props.deleteDisabled}
                    onClick={this.props.onDeleteClicked}
                    className={classes.toolbarButton}
                >
                    <DeleteIcon color="primary" />
                    {getMessage("delete")}
                </Button>
            </Toolbar>
        );
    }
}
export default withStyles(exStyles)(withI18N(NotificationToolbar, intlData));
