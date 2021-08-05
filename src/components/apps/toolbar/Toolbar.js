import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "i18n";

import ids from "../ids";

import AppsDotMenu from "./AppsDotMenu";
import AppNavigation from "./AppNavigation";

import CreateAppMenuItem from "../menuItems/CreateAppMenuItem";
import CreateWorkflowMenuItem from "../menuItems/CreateWorkflowMenuItem";

import appType from "components/models/AppType";
import AppsTypeFilter from "components/apps/AppsTypeFilter";

import NavigationConstants from "common/NavigationConstants";

import SearchField from "components/searchField/SearchField";
import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";
import {
    Button,
    Hidden,
    Toolbar,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import {
    Add as CreateAppIcon,
    Info,
    Build,
    FilterList as FilterListIcon,
    Queue as AddToBagIcon,
} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SharingButton from "components/sharing/SharingButton";

export const ADMIN_APPS_FILTER_VALUES = {
    PRIVATE: "private",
    PUBLIC: "public",
    ALL: "all",
};

function PermissionsFilter(props) {
    const { baseId, filter, handleFilterChange, classes } = props;
    const { t } = useTranslation("apps");
    return (
        <Autocomplete
            id={buildID(baseId, ids.ADMIN_APPS_FILTER)}
            value={filter}
            disabled={false}
            options={getOwnershipFilters(t)}
            size="small"
            onChange={(event, filter) => {
                handleFilterChange(filter);
            }}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option?.name === value?.name}
            className={classes.filter}
            renderInput={(params) => (
                <TextField
                    {...params}
                    id={buildID(baseId, ids.ADMIN_APPS_FILTER_FIELD)}
                    label={t("filterLbl")}
                    variant="outlined"
                />
            )}
        />
    );
}

function getOwnershipFilters(t) {
    return [
        {
            name: t("publicApps"),
            value: ADMIN_APPS_FILTER_VALUES.PUBLIC,
        },
        {
            name: t("privateApps"),
            value: ADMIN_APPS_FILTER_VALUES.PRIVATE,
        },
        {
            name: t("allApps"),
            value: ADMIN_APPS_FILTER_VALUES.ALL,
        },
    ];
}

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
        isAdminView,
        handleSearch,
        searchTerm,
        adminOwnershipFilter,
        handleAdminOwnershipFilterChange,
    } = props;
    const { t } = useTranslation("apps");
    const classes = useStyles();
    const appsToolbarId = buildID(baseId, ids.APPS_TOOLBAR);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);

    return (
        <>
            {isAdminView && (
                <Toolbar variant="dense">
                    <SearchField
                        handleSearch={handleSearch}
                        value={searchTerm}
                        id={buildID(baseId, ids.ADMIN_APPS_SEARCH)}
                        placeholder={t("searchApps")}
                    />
                    <PermissionsFilter
                        baseId={baseId}
                        filter={adminOwnershipFilter}
                        classes={classes}
                        handleFilterChange={handleAdminOwnershipFilterChange}
                    />
                </Toolbar>
            )}
            {!isAdminView && (
                <Toolbar>
                    <AppNavigation
                        baseId={appsToolbarId}
                        handleCategoryChange={handleCategoryChange}
                        setCategoryStatus={setCategoryStatus}
                        selectedCategory={selectedCategory}
                        handleAppNavError={handleAppNavError}
                    />
                    {viewAllApps && (
                        <Button
                            id={buildID(appsToolbarId, ids.VIEW_ALL_APPS)}
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
                            disabled={
                                selectedCategory?.system_id?.toLowerCase() ===
                                appType.agave.value.toLowerCase()
                            }
                        />
                    </Hidden>
                    <Hidden smDown>
                        {addToBagEnabled && (
                            <Button
                                id={buildID(appsToolbarId, ids.ADD_TO_BAG_BTN)}
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
                                id={buildID(appsToolbarId, ids.DETAILS_BTN)}
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
                        <Link href={NavigationConstants.TOOLS}>
                            <Button
                                id={buildID(appsToolbarId, ids.TOOLS_BTN)}
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
                    <Hidden xsDown>
                        <DotMenu
                            baseId={buildID(appsToolbarId, ids.CREATE_APP_BTN)}
                            ButtonProps={{
                                className: classes.toolbarItems,
                                startIcon: <CreateAppIcon />,
                            }}
                            buttonText={t("create")}
                            render={(onClose) => [
                                <CreateAppMenuItem
                                    key={ids.CREATE_APP_MENU_ITEM}
                                    baseId={appsToolbarId}
                                />,
                                <CreateWorkflowMenuItem
                                    key={ids.CREATE_WORKFLOW_MENU_ITEM}
                                    baseId={appsToolbarId}
                                />,
                            ]}
                        />
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
            )}

            <Dialog open={openFilterDialog}>
                <DialogContent>
                    <AppsTypeFilter
                        baseId={appsToolbarId}
                        classes={classes}
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                        disabled={
                            selectedCategory?.system_id?.toLowerCase() ===
                            appType.agave.value.toLowerCase()
                        }
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
export { getOwnershipFilters };
