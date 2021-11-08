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

import AppsTypeFilter from "components/apps/AppsTypeFilter";

import buildID from "components/utils/DebugIDUtil";


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
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";

import {
    FilterList as FilterListIcon,
    Info,
    Queue as AddToBagIcon,
    Refresh,
} from "@material-ui/icons";
import SharingButton from "components/sharing/SharingButton";
import Sharing from "components/sharing";
import { formatSharedAnalyses } from "components/sharing/util";
import TerminateAnalysisDialog from "./TerminateAnalysisDialog";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        color: theme.palette.info.contrastText,
    },
    divider: {
        flexGrow: 1,
    },
    filter: {
        width: 175,
        margin: theme.spacing(0.5),
    },
    filterIcon: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.2),
            paddingLeft: 0,
        },
    },
    toolbarItems: {
        margin: theme.spacing(0.5),
    },
}));

function PermissionsFilter(props) {
    const { baseId, filter, handleFilterChange, classes } = props;
    const { t } = useTranslation("analyses");
    return (
        <Autocomplete
            id={buildID(baseId, ids.VIEW_FILTER)}
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
                    id={buildID(baseId, ids.VIEW_FILTER_FIELD)}
                    label={t("viewFilter")}
                    variant="outlined"
                />
            )}
        />
    );
}

function getOwnershipFilters(t) {
    return Object.values([t("mine"), t("theirs")]).map((filter) => {
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
            id={buildID(baseId, ids.CLEAR_FILTER)}
        >
            <Button
                id={buildID(baseId, ids.CLEAR_FILTER)}
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
        setPendingTerminationDlgOpen,
        handleTimeLimitExtnClick,
        onRefreshSelected,
        setVICELogsDlgOpen
    } = props;
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation("analyses");
    const analysesNavId = buildID(baseId, ids.ANALYSES_NAVIGATION);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);
    const [terminateAnalysisDlgOpen, setTerminateAnalysisDlgOpen] =
        useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const hasSelection = getSelectedAnalyses
        ? getSelectedAnalyses()?.length > 0
        : false;
    const sharingAnalyses = formatSharedAnalyses(getSelectedAnalyses());
    const handleTerminateSelected = () => setTerminateAnalysisDlgOpen(true);

    return (
        <>
            <Toolbar variant="dense" id={analysesNavId} style={{ padding: 0 }}>
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
                            disabled={false}
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
                <Button
                    id={buildID(analysesNavId, ids.REFRESH_BTN)}
                    variant="outlined"
                    size="small"
                    disableElevation
                    color="primary"
                    onClick={onRefreshSelected}
                    className={classes.button}
                    startIcon={<Refresh />}
                >
                    <Hidden xsDown>{t("refresh")}</Hidden>
                </Button>
                <Hidden smDown>
                    {isSingleSelection && (
                        <Button
                            id={buildID(analysesNavId, ids.DETAILS_BTN)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            disableElevation
                            color="primary"
                            onClick={onDetailsSelected}
                            startIcon={<Info />}
                            size="small"
                        >
                            {t("details")}
                        </Button>
                    )}
                    {hasSelection && (
                        <Button
                            id={buildID(analysesNavId, ids.ADD_TO_BAG_BTN)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            disableElevation
                            color="primary"
                            onClick={onAddToBagSelected}
                            startIcon={<AddToBagIcon />}
                            size="small"
                        >
                            {t("addToBag")}
                        </Button>
                    )}
                    {canShare && (
                        <SharingButton
                            baseId={baseId}
                            setSharingDlgOpen={setSharingDlgOpen}
                            size="small"
                        />
                    )}
                </Hidden>
                {(hasSelection || isMobile) && (
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
                        handleDelete={handleDelete}
                        handleRelaunch={handleRelaunch}
                        handleRename={handleRename}
                        handleTerminateSelected={handleTerminateSelected}
                        handleBatchIconClick={handleBatchIconClick}
                        onFilterSelected={() => setOpenFilterDialog(true)}
                        canShare={canShare}
                        setSharingDlgOpen={setSharingDlgOpen}
                        setPendingTerminationDlgOpen={
                            setPendingTerminationDlgOpen
                        }
                        handleTimeLimitExtnClick={handleTimeLimitExtnClick}
                        setVICELogsDlgOpen={setVICELogsDlgOpen}
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
                        disabled={false}
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
            <TerminateAnalysisDialog
                open={terminateAnalysisDlgOpen}
                onClose={() => setTerminateAnalysisDlgOpen(false)}
                getSelectedAnalyses={getSelectedAnalyses}
                handleSaveAndComplete={handleSaveAndComplete}
                handleCancel={handleCancel}
            />
        </>
    );
}

export { getOwnershipFilters };
export default AnalysesToolbar;
