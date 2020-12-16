/**
 * @author sriram
 *
 * A toolbar for tools view
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";

import ids from "../ids";
import ToolsDotMenu from "./ToolsDotMenu";

import SharingButton from "components/sharing/SharingButton";
import Sharing from "components/sharing";
import { formatSharedTools } from "components/sharing/util";
import EditToolDialog from "components/tools/edit/EditTool";

import { build, SearchField } from "@cyverse-de/ui-lib";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Hidden,
    makeStyles,
    TextField,
    Toolbar,
} from "@material-ui/core";

import { Info } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";

export const TOOL_FILTER_VALUES = {
    ALL: "ALL",
    MY_TOOLS: "MY_TOOLS",
    PUBLIC: "PUBLIC",
};

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

function PermissionsFilter(props) {
    const { baseId, filter, handleFilterChange, classes } = props;
    const { t } = useTranslation("tools");
    return (
        <Autocomplete
            id={build(baseId, ids.MANAGE_TOOLS.TOOL_FILTER)}
            disabled={false}
            value={filter}
            options={getOwnershipFilters(t)}
            size="small"
            onChange={(event, filter) => {
                handleFilterChange(filter?.value);
            }}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            className={classes.filter}
            renderInput={(params) => (
                <TextField
                    {...params}
                    id={build(baseId, ids.MANAGE_TOOLS.VIEW_FILTER_FIELD)}
                    label={t("viewFilter")}
                    variant="outlined"
                />
            )}
        />
    );
}

function getOwnershipFilters(t) {
    return [
        {
            name: t("allTools"),
            value: TOOL_FILTER_VALUES.ALL,
        },
        {
            name: t("myTools"),
            value: TOOL_FILTER_VALUES.MY_TOOLS,
        },
        {
            name: t("publicTools"),
            value: TOOL_FILTER_VALUES.PUBLIC,
        },
    ];
}

export default function ToolsToolbar(props) {
    const {
        baseId,
        onDetailsSelected,
        isSingleSelection,
        canShare,
        getSelectedTools,
        ownershipFilter,
        handleOwnershipFilterChange,
        handleSearch,
        searchTerm,
    } = props;

    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const classes = useStyles();
    const { t } = useTranslation("tools");
    const { t: i18nCommon } = useTranslation("common");

    const hasSelection = getSelectedTools
        ? getSelectedTools().length > 0
        : false;
    const sharingTools = formatSharedTools(getSelectedTools());

    return (
        <>
            <Toolbar variant="dense">
                <Hidden xsDown>
                    <PermissionsFilter
                        baseId={baseId}
                        filter={ownershipFilter}
                        classes={classes}
                        handleFilterChange={handleOwnershipFilterChange}
                    />
                    <SearchField
                        handleSearch={handleSearch}
                        value={searchTerm}
                        id={build(baseId, ids.MANAGE_TOOLS.SEARCH)}
                        placeholder={t("searchTools")}
                    />
                </Hidden>
                <div className={classes.divider} />
                <Hidden smDown>
                    {isSingleSelection && (
                        <Button
                            id={build(baseId, ids.MANAGE_TOOLS.TOOL_INFO_BTN)}
                            className={classes.toolbarItems}
                            variant="outlined"
                            disableElevation
                            color="primary"
                            onClick={onDetailsSelected}
                            startIcon={<Info />}
                        >
                            {t("detailsLbl")}
                        </Button>
                    )}
                    {canShare && (
                        <SharingButton
                            baseId={baseId}
                            setSharingDlgOpen={setSharingDlgOpen}
                        />
                    )}
                </Hidden>
                <ToolsDotMenu
                    baseId={baseId}
                    onDetailsSelected={onDetailsSelected}
                    isSingleSelection={isSingleSelection}
                    canShare={canShare}
                    setSharingDlgOpen={setSharingDlgOpen}
                    getSelectedTools={getSelectedTools}
                    onAddToolSelected={() => setAddDialogOpen(true)}
                    onEditToolSelected={() => setEditDialogOpen(true)}
                    onFilterSelected={() => setOpenFilterDialog(true)}
                />
            </Toolbar>
            <Sharing
                open={sharingDlgOpen}
                onClose={() => setSharingDlgOpen(false)}
                resources={sharingTools}
            />
            {isSingleSelection && (
                <EditToolDialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    isAdmin={false}
                    isAdminPublishing={false}
                    parentId={baseId}
                    tool={hasSelection ? getSelectedTools()[0] : null}
                />
            )}

            <EditToolDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                isAdmin={false}
                isAdminPublishing={false}
                parentId={baseId}
            />
            <Dialog open={openFilterDialog}>
                <DialogContent>
                    <PermissionsFilter
                        baseId={baseId}
                        filter={ownershipFilter}
                        classes={classes}
                        handleFilterChange={handleOwnershipFilterChange}
                    />
                    <SearchField
                        handleSearch={handleSearch}
                        value={searchTerm}
                        id={build(baseId, ids.MANAGE_TOOLS.SEARCH)}
                        placeholder={t("searchTools")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFilterDialog(false)}>
                        {i18nCommon("done")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
