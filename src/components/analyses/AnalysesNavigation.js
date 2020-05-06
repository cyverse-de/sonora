/**
 * @author sriram
 *
 * A component that acts as a Navigation bar to the analyses listing view.
 * It contains primary ways to filter the analyses view.
 */

import React from "react";
import ids from "./ids";
import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
import {
    Divider,
    Hidden,
    IconButton,
    Link,
    makeStyles,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { injectIntl } from "react-intl";
import messages from "./messages";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getAppTypeFilters } from "../apps/AppNavigation";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import {
    Apps as GridIcon,
    FormatListBulleted as TableIcon,
    MoreVert as MoreVertIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        color: theme.palette.info.contrastText,
    },
    divider: {
        flexGrow: 1,
    },
    filter: {
        [theme.breakpoints.down("xs")]: {
            width: 125,
            margin: theme.spacing(1),
        },
        [theme.breakpoints.up("sm")]: {
            width: 150,
            margin: theme.spacing(1.5),
        },
    },
    batchFilter: {
        [theme.breakpoints.down("sm")]: {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: 75,
        },
    },
    verticalDivider: {
        margin: theme.spacing(1),
    },
}));

function getOwnershipFilters(intl) {
    return Object.values([
        formatMessage(intl, "all"),
        formatMessage(intl, "mine"),
        formatMessage(intl, "theirs"),
    ]).map((filter) => {
        return {
            name: filter,
        };
    });
}

function BatchFilter(props) {
    const { baseId, name, classes, onClearBatch } = props;

    return (
        <>
            <Tooltip
                title={getMessage("viewingBatch", {
                    values: { name: name },
                })}
                id={build(baseId, ids.BATCH_FILTER, name)}
            >
                <FilterListIcon color="primary" size="small" />
            </Tooltip>
            <Hidden xsDown>
                <Typography variant="caption" className={classes.batchFilter}>
                    {getMessage("viewingBatch", {
                        values: { name: name },
                    })}
                </Typography>

                <Divider
                    className={classes.verticalDivider}
                    orientation="vertical"
                    flexItem
                />
            </Hidden>
            <Hidden smUp>
                <Tooltip title={getMessage("viewAll")}>
                    <IconButton
                        id={build(baseId, ids.CLEAR_BATCH_FILTER, name)}
                        size="small"
                        onClick={onClearBatch}
                    >
                        <ClearIcon color="error" />
                    </IconButton>
                </Tooltip>
            </Hidden>
            <Hidden xsDown>
                <Link
                    component="button"
                    id={build(baseId, ids.CLEAR_BATCH_FILTER, name)}
                    style={{ cursor: "pointer" }}
                    onClick={onClearBatch}
                >
                    {getMessage("viewAll")}
                </Link>
            </Hidden>
        </>
    );
}

function AnalysesNavigation(props) {
    const classes = useStyles();
    const {
        baseId,
        appTypeFilter,
        ownershipFilter,
        handleAppTypeFilterChange,
        handleOwnershipFilterChange,
        viewBatch,
        onClearBatch,
        isGridView,
        intl,
        toggleDisplay,
    } = props;
    const analysesNavId = build(baseId, ids.ANALYSES_NAVIGATION);
    return (
        <Toolbar variant="dense" id={analysesNavId}>
            {isGridView && (
                <Tooltip
                    id={build(analysesNavId, ids.TABLE_VIEW_BTN, ids.TOOLTIP)}
                    title={getMessage("tableView")}
                    aria-label={formatMessage(intl, "tableView")}
                >
                    <IconButton
                        id={build(analysesNavId, ids.TABLE_VIEW_BTN)}
                        edge="start"
                        onClick={() => toggleDisplay()}
                        color="primary"
                    >
                        <TableIcon />
                    </IconButton>
                </Tooltip>
            )}
            {!isGridView && (
                <Tooltip
                    id={build(analysesNavId, ids.GRID_VIEW_BTN, ids.TOOLTIP)}
                    title={getMessage("gridView")}
                    aria-label={formatMessage(intl, "gridView")}
                >
                    <IconButton
                        id={build(analysesNavId, ids.GRID_VIEW_BTN)}
                        edge="start"
                        onClick={() => toggleDisplay()}
                        color="primary"
                    >
                        <GridIcon />
                    </IconButton>
                </Tooltip>
            )}
            {viewBatch && (
                <BatchFilter
                    baseId={analysesNavId}
                    name={viewBatch.name}
                    classes={classes}
                    onClearBatch={onClearBatch}
                />
            )}

            <Autocomplete
                id={build(analysesNavId, ids.VIEW_FILTER)}
                disabled={false}
                value={ownershipFilter}
                options={getOwnershipFilters(intl)}
                size="small"
                onChange={(event, newValue) => {
                    handleOwnershipFilterChange(newValue);
                }}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                    option.name === value.name
                }
                className={classes.filter}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id={build(analysesNavId, ids.VIEW_FILTER_FIELD)}
                        label={formatMessage(intl, "viewFilter")}
                        variant="outlined"
                    />
                )}
            />

            <Autocomplete
                id={build(analysesNavId, ids.APP_TYPE_FILTER)}
                disabled={false}
                value={appTypeFilter}
                options={getAppTypeFilters()}
                size="small"
                onChange={(event, newValue) => {
                    handleAppTypeFilterChange(newValue);
                }}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                    option.name === value.name
                }
                className={classes.filter}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        id={build(analysesNavId, ids.APP_TYPE_FILTER_FIELD)}
                        label={formatMessage(intl, "appTypeFilter")}
                        variant="outlined"
                    />
                )}
            />
            <div className={classes.divider} />
            <IconButton>
                <MoreVertIcon />
            </IconButton>
        </Toolbar>
    );
}

export { getOwnershipFilters };
export default withI18N(injectIntl(AnalysesNavigation), messages);
