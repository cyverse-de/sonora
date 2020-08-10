/**
 * @author sriram
 *
 * A component that acts as a Navigation bar to the analyses listing view.
 * It contains primary ways to filter the analyses view.
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";

import AnalysesDotMenu from "./AnalysesDotMenu";
import ids from "../ids";

import { getAppTypeFilters } from "components/apps/toolbar/AppNavigation";
import DisplayTypeSelector from "components/utils/DisplayTypeSelector";

import { build } from "@cyverse-de/ui-lib";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Hidden,
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
            width: 175,
            margin: theme.spacing(0.2),
        },
        [theme.breakpoints.up("sm")]: {
            width: 175,
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

function AppsTypeFilter(props) {
    const { baseId, filter, handleFilterChange, classes } = props;
    const { t } = useTranslation("analyses");
    return (
        <Autocomplete
            id={build(baseId, ids.APP_TYPE_FILTER)}
            disabled={false}
            value={filter}
            options={getAppTypeFilters()}
            size="small"
            onChange={(event, newValue) => {
                handleFilterChange(newValue);
            }}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            className={classes.filter}
            renderInput={(params) => (
                <TextField
                    {...params}
                    id={build(baseId, ids.APP_TYPE_FILTER_FIELD)}
                    label={t("appTypeFilter")}
                    variant="outlined"
                />
            )}
        />
    );
}

function PermissionsFilter(props) {
    const { baseId, filter, handleFilterChange, classes } = props;
    const { t } = useTranslation("analyses");
    return (
        <Autocomplete
            id={build(baseId, ids.VIEW_FILTER)}
            disabled={false}
            value={filter}
            options={getOwnershipFilters(t)}
            size="small"
            onChange={(event, newValue) => {
                handleFilterChange(newValue);
            }}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            className={classes.filter}
            renderInput={(params) => (
                <TextField
                    {...params}
                    id={build(baseId, ids.VIEW_FILTER_FIELD)}
                    label={t("viewFilter")}
                    variant="outlined"
                />
            )}
        />
    );
}

function getOwnershipFilters(t) {
    return Object.values([t("all"), t("mine"), t("theirs")]).map((filter) => {
        return {
            name: filter,
        };
    });
}

function ClearFilter(props) {
    const { baseId, classes, onClearFilter } = props;
    const { t } = useTranslation("analyses");

    return (
        <Tooltip
            title={t("clearFilter")}
            id={build(baseId, ids.CLEAR_FILTER)}
        >
            <Button
                id={build(baseId, ids.CLEAR_FILTER)}
                size="small"
                onClick={onClearFilter}
                className={classes.filterIcon}
                color="primary"
                variant="outlined"
                startIcon={<FilterListIcon />}
            >
                <Typography>{t("viewAll")}</Typography>
            </Button>
        </Tooltip>
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
        viewFiltered,
        onClearFilter,
        isGridView,
        toggleDisplay,
        detailsEnabled,
        onDetailsSelected,
        handleInteractiveUrlClick,
        handleGoToOutputFolder,
        handleDelete,
        handleRelaunch,
        handleBatchIconClick,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation("analyses");
    const analysesNavId = build(baseId, ids.ANALYSES_NAVIGATION);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    return (
        <>
            <Toolbar variant="dense" id={analysesNavId}>
                <Hidden smDown>
                    <DisplayTypeSelector
                        baseId={analysesNavId}
                        toggleDisplay={toggleDisplay}
                        isGridView={isGridView}
                    />
                </Hidden>
                <Hidden xsDown>
                    <>
                        <PermissionsFilter
                            baseId={analysesNavId}
                            filter={ownershipFilter}
                            classes={classes}
                            handleFilterChange={handleOwnershipFilterChange}
                        />
                        <AppsTypeFilter
                            baseId={analysesNavId}
                            filter={appTypeFilter}
                            classes={classes}
                            handleFilterChange={handleAppTypeFilterChange}
                        />
                    </>
                </Hidden>
                {viewFiltered && (
                    <ClearFilter
                        baseId={analysesNavId}
                        classes={classes}
                        onClearFilter={onClearFilter}
                    />
                )}

                <div className={classes.divider} />
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
                <AnalysesDotMenu
                    baseId={analysesNavId}
                    username={username}
                    onDetailsSelected={onDetailsSelected}
                    detailsEnabled={detailsEnabled}
                    selected={selected}
                    getSelectedAnalyses={getSelectedAnalyses}
                    handleInteractiveUrlClick={handleInteractiveUrlClick}
                    handleGoToOutputFolder={handleGoToOutputFolder}
                    handleDelete={handleDelete}
                    handleRelaunch={handleRelaunch}
                    handleBatchIconClick={handleBatchIconClick}
                    onFilterSelected={() => setOpenFilterDialog(true)}
                />
            </Toolbar>
            <Dialog open={openFilterDialog}>
                <DialogContent>
                    <PermissionsFilter
                        baseId={analysesNavId}
                        filter={ownershipFilter}
                        classes={classes}
                        handleFilterChange={handleOwnershipFilterChange}
                    />
                    <br />
                    <AppsTypeFilter
                        baseId={analysesNavId}
                        filter={appTypeFilter}
                        classes={classes}
                        handleFilterChange={handleAppTypeFilterChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFilterDialog(false)}>
                        {t("done")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export { getOwnershipFilters };
export default AnalysesToolbar;
