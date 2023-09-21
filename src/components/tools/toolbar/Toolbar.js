/**
 * @author sriram
 *
 * A toolbar for tools view
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";

import ids from "../ids";
import { canShare } from "../utils";

import ToolsDotMenu from "./ToolsDotMenu";

import SharingButton from "components/sharing/SharingButton";
import Sharing from "components/sharing";
import { formatSharedTools } from "components/sharing/util";
import EditToolDialog from "components/tools/edit/EditTool";
import { TOOL_FILTER_VALUES } from "components/tools/utils";

import buildID from "components/utils/DebugIDUtil";
import SearchField from "components/searchField/SearchField";
import NewToolRequestDialog from "../NewToolRequestDialog";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Hidden,
    TextField,
    Toolbar,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { Info } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        color: theme.palette.info.contrastText,
    },
    divider: {
        flexGrow: 1,
    },
    filter: {
        [theme.breakpoints.down("sm")]: {
            width: 175,
            margin: theme.spacing(0.2),
        },
        [theme.breakpoints.up("sm")]: {
            width: 175,
            margin: theme.spacing(1),
        },
    },
    filterIcon: {
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(0.2),
            paddingLeft: 0,
        },
    },
    toolbarItems: {
        [theme.breakpoints.down("sm")]: {
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
            id={buildID(baseId, ids.MANAGE_TOOLS.TOOL_FILTER)}
            disabled={false}
            value={filter}
            options={getOwnershipFilters(t)}
            size="small"
            onChange={(event, filter) => {
                handleFilterChange(filter?.value);
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            className={classes.filter}
            renderInput={(params) => (
                <TextField
                    {...params}
                    id={buildID(baseId, ids.MANAGE_TOOLS.VIEW_FILTER_FIELD)}
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
        disableDelete,
        disableEdit,
        disableShare,
        getSelectedTools,
        filterDisabled,
        ownershipFilter,
        handleOwnershipFilterChange,
        handleSearch,
        searchTerm,
        onDeleteToolSelected,
        isAdmin,
    } = props;

    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [sharingDlgOpen, setSharingDlgOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [requestDialogOpen, setRequestDialogOpen] = useState(false);
    const classes = useStyles();
    const { t } = useTranslation("tools");
    const { t: i18nCommon } = useTranslation("common");

    const hasSelection = getSelectedTools && getSelectedTools().length > 0;

    const sharingEnabled =
        !disableShare && hasSelection && canShare(getSelectedTools());
    const sharingTools = formatSharedTools(
        getSelectedTools && getSelectedTools()
    );

    return (
        <>
            <Toolbar variant="dense">
                <Hidden smDown>
                    {!(isAdmin || filterDisabled) && (
                        <PermissionsFilter
                            baseId={baseId}
                            filter={ownershipFilter}
                            classes={classes}
                            handleFilterChange={handleOwnershipFilterChange}
                        />
                    )}
                    <SearchField
                        handleSearch={handleSearch}
                        value={searchTerm}
                        id={buildID(baseId, ids.MANAGE_TOOLS.SEARCH)}
                        placeholder={t("searchTools")}
                    />
                </Hidden>
                <Hidden mdDown>
                    {isSingleSelection && (
                        <Button
                            id={buildID(baseId, ids.MANAGE_TOOLS.TOOL_INFO_BTN)}
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
                    {sharingEnabled && (
                        <SharingButton
                            baseId={baseId}
                            setSharingDlgOpen={setSharingDlgOpen}
                        />
                    )}
                </Hidden>
                <div className={classes.divider} />
                <ToolsDotMenu
                    baseId={baseId}
                    onDetailsSelected={onDetailsSelected}
                    isSingleSelection={isSingleSelection}
                    canDelete={!disableDelete}
                    canEdit={!disableEdit}
                    canShare={sharingEnabled}
                    setSharingDlgOpen={setSharingDlgOpen}
                    getSelectedTools={getSelectedTools}
                    onAddToolSelected={() => setAddDialogOpen(true)}
                    onEditToolSelected={() => setEditDialogOpen(true)}
                    onFilterSelected={() => setOpenFilterDialog(true)}
                    onRequestToolSelected={() => setRequestDialogOpen(true)}
                    onDeleteToolSelected={onDeleteToolSelected}
                    isAdmin={isAdmin}
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
                    isAdmin={isAdmin}
                    isAdminPublishing={false}
                    parentId={baseId}
                    tool={hasSelection ? getSelectedTools()[0] : null}
                />
            )}

            <EditToolDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                isAdmin={isAdmin}
                isAdminPublishing={false}
                parentId={baseId}
            />
            <Dialog open={openFilterDialog}>
                <DialogContent>
                    {!(isAdmin || filterDisabled) && (
                        <PermissionsFilter
                            baseId={baseId}
                            filter={ownershipFilter}
                            classes={classes}
                            handleFilterChange={handleOwnershipFilterChange}
                        />
                    )}
                    <SearchField
                        handleSearch={handleSearch}
                        value={searchTerm}
                        id={buildID(baseId, ids.MANAGE_TOOLS.SEARCH)}
                        placeholder={t("searchTools")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFilterDialog(false)}>
                        {i18nCommon("done")}
                    </Button>
                </DialogActions>
            </Dialog>
            <NewToolRequestDialog
                open={requestDialogOpen}
                onClose={() => setRequestDialogOpen(false)}
            />
        </>
    );
}
