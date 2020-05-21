/**
 * @author sriram
 *
 * A component that acts as a Navigation bar to the analyses listing view.
 * It contains primary ways to filter the analyses view.
 */

import React from "react";

import messages from "../messages";
import ids from "../ids";

import { getAppTypeFilters } from "../../apps/toolbar/AppNavigation";
import DisplayTypeSelector from "../../utils/DisplayTypeSelector";

import { injectIntl } from "react-intl";

import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";

import {
    Button,
    Hidden,
    IconButton,
    makeStyles,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";

import { Info, FilterList as FilterListIcon } from "@material-ui/icons";
import AnalysesDotMenu from "./AnalysesDotMenu";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        color: theme.palette.info.contrastText,
    },
    divider: {
        flexGrow: 1,
    },
    filter: {
        [theme.breakpoints.down("xs")]: {
            width: 110,
            margin: theme.spacing(0.2),
        },
        [theme.breakpoints.up("sm")]: {
            width: 150,
            margin: theme.spacing(1),
        },
    },
    filterIcon: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.2),
            paddingLeft: 0,
        },
    },
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
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
            <Hidden xsDown>
                <Tooltip
                    title={getMessage("viewingBatch", {
                        values: { name: name },
                    })}
                    id={build(baseId, ids.BATCH_FILTER, name)}
                >
                    <Button
                        id={build(baseId, ids.CLEAR_BATCH_FILTER, name)}
                        size="small"
                        onClick={onClearBatch}
                        className={classes.filterIcon}
                        color="primary"
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                    >
                        <Typography>{getMessage("viewAll")}</Typography>
                    </Button>
                </Tooltip>
            </Hidden>
            <Hidden smUp>
                <IconButton
                    id={build(baseId, ids.CLEAR_BATCH_FILTER, name)}
                    size="small"
                    onClick={onClearBatch}
                    color="primary"
                    className={classes.filterIcon}
                >
                    <FilterListIcon />
                </IconButton>
            </Hidden>
        </>
    );
}

function AnalysesToolbar(props) {
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
        detailsEnabled,
        onDetailsSelected,
    } = props;
    const analysesNavId = build(baseId, ids.ANALYSES_NAVIGATION);
    return (
        <Toolbar variant="dense" id={analysesNavId}>
            <DisplayTypeSelector
                baseId={analysesNavId}
                toggleDisplay={toggleDisplay}
                isGridView={isGridView}
            />
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
            {viewBatch && (
                <BatchFilter
                    baseId={analysesNavId}
                    name={viewBatch.name}
                    classes={classes}
                    onClearBatch={onClearBatch}
                />
            )}
            <Hidden smDown>
                <div className={classes.divider} />
                <Hidden smDown>
                    {detailsEnabled && (
                        <Button
                            id={build(analysesNavId, ids.DETAILS_BTN)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            disableElevation
                            color="primary"
                            onClick={onDetailsSelected}
                            startIcon={<Info />}
                        >
                            {getMessage("details")}
                        </Button>
                    )}
                </Hidden>
            </Hidden>
            <AnalysesDotMenu
                baseId={analysesNavId}
                onDetailsSelected={onDetailsSelected}
                detailsEnabled={detailsEnabled}
            />
        </Toolbar>
    );
}

export { getOwnershipFilters };
export default withI18N(injectIntl(AnalysesToolbar), messages);
