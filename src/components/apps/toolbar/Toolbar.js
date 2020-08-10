import React, { useState } from "react";

import ids from "../ids";
import messages from "../messages";
import { injectIntl } from "react-intl";

import appType from "../../models/AppType";
import AppsDotMenu from "./AppsDotMenu";
import DisplayTypeSelector from "../../utils/DisplayTypeSelector";
import AppNavigation, { getAppTypeFilters } from "./AppNavigation";

import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
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
import { Info, FilterList as FilterListIcon } from "@material-ui/icons";

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
        intl,
    } = props;
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
                    label={formatMessage(intl, "filterLbl")}
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
        isGridView,
        toggleDisplay,
        detailsEnabled,
        onDetailsSelected,
        intl,
        baseId,
    } = props;

    const classes = useStyles();
    const appsToolbarId = build(baseId, ids.APPS_TOOLBAR);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);

    return (
        <>
            <Toolbar variant="dense">
                <Hidden smDown>
                    <DisplayTypeSelector
                        baseId={appsToolbarId}
                        toggleDisplay={toggleDisplay}
                        isGridView={isGridView}
                    />
                </Hidden>
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
                        {getMessage("viewAllApps")}
                    </Button>
                )}
                <div className={classes.divider} />
                <Hidden xsDown>
                    <AppsTypeFilter
                        baseId={appsToolbarId}
                        classes={classes}
                        intl={intl}
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                        selectedCategory={selectedCategory}
                    />

                    {detailsEnabled && (
                        <Button
                            id={build(appsToolbarId, ids.DETAILS_BTN)}
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
                <AppsDotMenu
                    baseId={appsToolbarId}
                    detailsEnabled={detailsEnabled}
                    onDetailsSelected={onDetailsSelected}
                    onFilterSelected={() => setOpenFilterDialog(true)}
                />
            </Toolbar>
            <Dialog open={openFilterDialog}>
                <DialogContent>
                    <AppsTypeFilter
                        baseId={appsToolbarId}
                        classes={classes}
                        intl={intl}
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                        selectedCategory={selectedCategory}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFilterDialog(false)}>
                        {getMessage("done")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default withI18N(injectIntl(AppsToolbar), messages);
