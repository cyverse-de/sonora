/**
 * @author sriram
 *
 * A component that acts as a Navigation bar to the analyses listing view.
 * It contains primary ways to filter the analyses view.
 */

import React from "react";
import { useTranslation } from "react-i18next";

import AnalysesDotMenu from "./AnalysesDotMenu";
import ids from "../ids";

import { getAppTypeFilters } from "components/apps/toolbar/AppNavigation";
import DisplayTypeSelector from "components/utils/DisplayTypeSelector";

import { build } from "@cyverse-de/ui-lib";

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

function getOwnershipFilters(t) {
    return Object.values([t("all"), t("mine"), t("theirs")]).map((filter) => {
        return {
            name: filter,
        };
    });
}

function BatchFilter(props) {
    const { baseId, name, classes, onClearBatch } = props;
    const { t } = useTranslation("analyses");

    return (
        <>
            <Hidden xsDown>
                <Tooltip
                    title={t("viewingBatch", { name: name })}
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
                        <Typography>{t("viewAll")}</Typography>
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
    const {
        baseId,
        selected,
        username,
        getSelectedAnalyses,
        appTypeFilter,
        ownershipFilter,
        handleAppTypeFilterChange,
        handleOwnershipFilterChange,
        viewBatch,
        onClearBatch,
        isGridView,
        toggleDisplay,
        detailsEnabled,
        onDetailsSelected,
        handleInteractiveUrlClick,
        handleGoToOutputFolder,
        handleRelaunch,
        handleBatchIconClick,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation("analyses");
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
                options={getOwnershipFilters(t)}
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
                        label={t("viewFilter")}
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
                        label={t("appTypeFilter")}
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
                        {t("details")}
                    </Button>
                )}
            </Hidden>
            {selected?.length > 0 && (
                <AnalysesDotMenu
                    baseId={analysesNavId}
                    username={username}
                    onDetailsSelected={onDetailsSelected}
                    detailsEnabled={detailsEnabled}
                    selected={selected}
                    getSelectedAnalyses={getSelectedAnalyses}
                    handleInteractiveUrlClick={handleInteractiveUrlClick}
                    handleGoToOutputFolder={handleGoToOutputFolder}
                    handleRelaunch={handleRelaunch}
                    handleBatchIconClick={handleBatchIconClick}
                />
            )}
        </Toolbar>
    );
}

export { getOwnershipFilters };
export default AnalysesToolbar;
