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
import ownershipFilter from "./model/ownershipFilter";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        color: theme.palette.primary.contrastText,
    },
    divider: {
        flexGrow: 1,
    },
    filter: {
        [theme.breakpoints.down("xs")]: {
            width: 130,
        },
        [theme.breakpoints.up("sm")]: {
            width: 150,
        },
        margin: theme.spacing(1.5),
    },
    batchFilter: {
        [theme.breakpoints.down("sm")]: {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: 75,
        },
    },
}));

function getOwnershipFilters() {
    return Object.keys(ownershipFilter).map((filter) => {
        return {
            name: ownershipFilter[filter],
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
                    style={{ margin: 8 }}
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
                    id={build(baseId, ids.clearBatchFilter, name)}
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
        intl,
    } = props;
    const analysesNavId = build(baseId, ids.ANALYSES_NAVIGATION);
    return (
        <Toolbar variant="dense" id={analysesNavId}>
            {viewBatch && (
                <BatchFilter
                    baseId={analysesNavId}
                    name={viewBatch.name}
                    classes={classes}
                    onClearBatch={onClearBatch}
                />
            )}
            <div className={classes.divider} />
            <Autocomplete
                disabled={false}
                value={ownershipFilter}
                options={getOwnershipFilters()}
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
                        label={formatMessage(intl, "viewFilter")}
                        variant="outlined"
                    />
                )}
            />

            <Autocomplete
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
                        label={formatMessage(intl, "appTypeFilter")}
                        variant="outlined"
                    />
                )}
            />
        </Toolbar>
    );
}

export { getOwnershipFilters };
export default withI18N(injectIntl(AnalysesNavigation), messages);
