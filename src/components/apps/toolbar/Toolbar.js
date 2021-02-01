import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "i18n";

import ids from "../ids";

import appType from "../../models/AppType";
import AppsDotMenu from "./AppsDotMenu";
import AppNavigation, { getAppTypeFilters } from "./AppNavigation";

import NavigationConstants from "common/NavigationConstants";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    Hidden,
    TextField,
    Toolbar,
    Dialog,
    DialogActions,
    DialogContent,
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import {
    Info,
    Build,
    FilterList as FilterListIcon,
    Queue as AddToBagIcon,
} from "@material-ui/icons";
import SharingButton from "components/sharing/SharingButton";

/**
 *
 * A toolbar with menu and navigation actions for apps
 *
 * @param props
 * @constructor
 */

const useStyles = makeStyles((theme) => ({
    divider: {
        flexGrow: 1,
    },
    filter: {
        width: 200,
        margin: theme.spacing(1),
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
    const {
        baseId,
        selectedCategory,
        filter,
        handleFilterChange,
        classes,
    } = props;
    const { t } = useTranslation("apps");
    return (
        <Autocomplete
            id={build(baseId, ids.APPS_FILTER)}
            disabled={
                selectedCategory?.system_id?.toLowerCase() ===
                appType.agave.toLowerCase()
            }
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
                    label={t("filterLbl")}
                    variant="outlined"
                />
            )}
        />
    );
}

function AppsToolbar(props) {
    const {
        handleCategoryChange,
        handleFilterChange,
        handleAppNavError,
        setCategoryStatus,
        viewAllApps,
        filter,
        selectedCategory,
        detailsEnabled,
        onDetailsSelected,
        addToBagEnabled,
        onAddToBagClicked = () => {},
        canShare,
        setSharingDlgOpen,
        onDocSelected,
        onQLSelected,
        baseId,
    } = props;
    const { t } = useTranslation("apps");
    const classes = useStyles();
    const appsToolbarId = build(baseId, ids.APPS_TOOLBAR);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);

    return (
        <>
            <Toolbar variant="dense">
                <AppNavigation
                    baseId={appsToolbarId}
                    handleCategoryChange={handleCategoryChange}
                    setCategoryStatus={setCategoryStatus}
                    selectedCategory={selectedCategory}
                    handleAppNavError={handleAppNavError}
                />
                {viewAllApps && (
                    <Button
                        id={build(appsToolbarId, ids.VIEW_ALL_APPS)}
                        variant="outlined"
                        disableElevation
                        color="primary"
                        onClick={viewAllApps}
                        startIcon={<FilterListIcon />}
                    >
                        {t("viewAllApps")}
                    </Button>
                )}
                <div className={classes.divider} />
                <Hidden xsDown>
                    <AppsTypeFilter
                        baseId={appsToolbarId}
                        classes={classes}
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                        selectedCategory={selectedCategory}
                    />
                </Hidden>
                <Hidden smDown>
                    {addToBagEnabled && (
                        <Button
                            id={build(appsToolbarId, ids.ADD_TO_BAG_BTN)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            disableElevation
                            color="primary"
                            onClick={onAddToBagClicked}
                            startIcon={<AddToBagIcon />}
                            size="small"
                        >
                            {t("addToBag")}
                        </Button>
                    )}
                </Hidden>
                <Hidden smDown>
                    {detailsEnabled && (
                        <Button
                            id={build(appsToolbarId, ids.DETAILS_BTN)}
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
                    {canShare && (
                        <SharingButton
                            baseId={baseId}
                            setSharingDlgOpen={setSharingDlgOpen}
                            size="small"
                        />
                    )}
                </Hidden>
                <Hidden xsDown>
                    <Link href={`${NavigationConstants.TOOLS}`}>
                        <Button
                            id={build(appsToolbarId, ids.TOOLS_BTN)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            disableElevation
                            color="primary"
                            startIcon={<Build />}
                            size="small"
                        >
                            {t("manageTools")}
                        </Button>
                    </Link>
                </Hidden>
                <Hidden mdUp>
                    <AppsDotMenu
                        baseId={appsToolbarId}
                        detailsEnabled={detailsEnabled}
                        onDetailsSelected={onDetailsSelected}
                        addToBagEnabled={addToBagEnabled}
                        onAddToBagClicked={onAddToBagClicked}
                        onFilterSelected={() => setOpenFilterDialog(true)}
                        canShare={canShare}
                        setSharingDlgOpen={setSharingDlgOpen}
                        onDocSelected={onDocSelected}
                        onQLSelected={onQLSelected}
                    />
                </Hidden>
            </Toolbar>
            <Dialog open={openFilterDialog}>
                <DialogContent>
                    <AppsTypeFilter
                        baseId={appsToolbarId}
                        classes={classes}
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                        selectedCategory={selectedCategory}
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

export default AppsToolbar;
