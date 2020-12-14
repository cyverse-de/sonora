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

import {
    Info,
    FilterList as FilterListIcon,
    Queue as AddToBagIcon,
} from "@material-ui/icons";
import SharingButton from "components/sharing/SharingButton";
import Sharing from "components/sharing";
import { formatSharedAnalyses } from "components/sharing/util";

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
        <Tooltip title={t("clearFilter")} id={build(baseId, ids.CLEAR_FILTER)}>
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
        username,
        getSelectedAnalyses,
        appTypeFilter,
        ownershipFilter,
        handleAppTypeFilterChange,
        handleOwnershipFilterChange,
        viewFiltered,
        onClearFilter,
        isSingleSelection,
        onDetailsSelected,
        onAddToBagSelected,
        handleComments,
        handleInteractiveUrlClick,
        handleCancel,
        handleDelete,
        handleRelaunch,
        handleRename,
        handleSaveAndComplete,
        handleBatchIconClick,
        canShare,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation("analyses");
    const analysesNavId = build(baseId, ids.ANALYSES_NAVIGATION);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);

    const hasSelection = getSelectedAnalyses
        ? getSelectedAnalyses().length > 0
        : false;
    const sharingAnalyses = formatSharedAnalyses(getSelectedAnalyses());

    return (
        <>
            <Toolbar variant="dense" id={analysesNavId}>
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
                <Hidden smDown>
                    {isSingleSelection && (
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
                    {hasSelection && (
                        <Button
                            id={build(analysesNavId, ids.ADD_TO_BAG_BTN)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            disableElevation
                            color="primary"
                            onClick={onAddToBagSelected}
                            startIcon={<AddToBagIcon />}
                        >
                            {t("addToBag")}
                        </Button>
                    )}
                    {canShare && (
                        <SharingButton
                            baseId={baseId}
                            setSharingDlgOpen={setSharingDlgOpen}
                        />
                    )}
                </Hidden>
                {hasSelection && (
                    <AnalysesDotMenu
                        baseId={analysesNavId}
                        username={username}
                        onDetailsSelected={onDetailsSelected}
                        onAddToBagSelected={onAddToBagSelected}
                        isSingleSelection={isSingleSelection}
                        hasSelection={hasSelection}
                        getSelectedAnalyses={getSelectedAnalyses}
                        handleComments={handleComments}
                        handleInteractiveUrlClick={handleInteractiveUrlClick}
                        handleCancel={handleCancel}
                        handleDelete={handleDelete}
                        handleRelaunch={handleRelaunch}
                        handleRename={handleRename}
                        handleSaveAndComplete={handleSaveAndComplete}
                        handleBatchIconClick={handleBatchIconClick}
                        onFilterSelected={() => setOpenFilterDialog(true)}
                        canShare={canShare}
                        setSharingDlgOpen={setSharingDlgOpen}
                    />
                )}
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
            <Sharing
                open={sharingDlgOpen}
                onClose={() => setSharingDlgOpen(false)}
                resources={sharingAnalyses}
            />
        </>
    );
}

export { getOwnershipFilters };
export default AnalysesToolbar;
