/**
 * @author sriram
 *
 * A dot menu for Analyses View.
 *
 */

import React from "react";
import { useTranslation } from "i18n";

import ids from "../ids";

import {
    isInteractive,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
    allowAnalysesCancel,
    allowAnalysesDelete,
    allowAnalysesRelaunch,
    allowAnalysisEdit,
} from "../utils";

import { build, DotMenu } from "@cyverse-de/ui-lib";
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import {
    Info,
    FilterList,
    HourglassEmptyRounded as HourGlassIcon,
    Launch as LaunchIcon,
    PermMedia as OutputFolderIcon,
    Repeat as RelaunchIcon,
    Edit as RenameIcon,
    Cancel as CancelIcon,
    Comment as CommentIcon,
    Delete as DeleteIcon,
    UnfoldMore as UnfoldMoreIcon,
} from "@material-ui/icons";

function DotMenuItems(props) {
    const {
        baseId,
        onDetailsSelected,
        handleComments,
        handleInteractiveUrlClick,
        handleGoToOutputFolder,
        handleCancel,
        handleDelete,
        handleRelaunch,
        handleRename,
        handleBatchIconClick,
        isBatch,
        isVICE,
        allowTimeExtn,
        allowCancel,
        allowDelete,
        allowRelaunch,
        allowEdit,
        onClose,
        selectedAnalyses,
        isSingleSelection,
        onFilterSelected,
    } = props;
    const { t } = useTranslation("analyses");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    return [
        isSingleSelection && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_DETAILS)}
                id={build(baseId, ids.MENUITEM_DETAILS)}
                onClick={() => {
                    onClose();
                    onDetailsSelected();
                }}
            >
                <ListItemIcon>
                    <Info fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("details")} />
            </MenuItem>
        ),
        isSingleSelection && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_GO_TO_FOLDER)}
                id={build(baseId, ids.MENUITEM_GO_TO_FOLDER)}
                onClick={() => {
                    onClose();
                    handleGoToOutputFolder(selectedAnalyses[0]);
                }}
            >
                <ListItemIcon>
                    <OutputFolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("goOutputFolder")} />
            </MenuItem>
        ),
        allowRelaunch && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_RELAUNCH)}
                id={build(baseId, ids.MENUITEM_RELAUNCH)}
                onClick={() => {
                    onClose();
                    handleRelaunch(selectedAnalyses);
                }}
            >
                <ListItemIcon>
                    <RelaunchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("relaunch")} />
            </MenuItem>
        ),
        allowEdit && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_RENAME)}
                id={build(baseId, ids.MENUITEM_RENAME)}
                onClick={() => {
                    onClose();
                    handleRename(selectedAnalyses[0]);
                }}
            >
                <ListItemIcon>
                    <RenameIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("rename")} />
            </MenuItem>
        ),
        allowEdit && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_UPDATE_COMMENTS)}
                id={build(baseId, ids.MENUITEM_UPDATE_COMMENTS)}
                onClick={() => {
                    onClose();
                    handleComments(selectedAnalyses[0]);
                }}
            >
                <ListItemIcon>
                    <CommentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("updateComments")} />
            </MenuItem>
        ),
        isBatch && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_BATCH_FILTER)}
                id={build(baseId, ids.MENUITEM_BATCH_FILTER)}
                onClick={() => {
                    onClose();
                    handleBatchIconClick(selectedAnalyses[0]);
                }}
            >
                <ListItemIcon>
                    <UnfoldMoreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("htDetails")} />
            </MenuItem>
        ),
        isVICE && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_GOTO_VICE)}
                id={build(baseId, ids.MENUITEM_GOTO_VICE)}
                onClick={() => {
                    onClose();
                    handleInteractiveUrlClick();
                }}
            >
                <ListItemIcon>
                    <LaunchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("goToVice")} />
            </MenuItem>
        ),
        allowTimeExtn && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_EXTEND_TIME_LIMIT)}
                id={build(baseId, ids.MENUITEM_EXTEND_TIME_LIMIT)}
                onClick={() => {
                    onClose();
                }}
            >
                <ListItemIcon>
                    <HourGlassIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("extendTime")} />
            </MenuItem>
        ),
        allowCancel && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_CANCEL)}
                id={build(baseId, ids.MENUITEM_CANCEL)}
                onClick={() => {
                    onClose();
                    handleCancel(selectedAnalyses);
                }}
            >
                <ListItemIcon>
                    <CancelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("cancel")} />
            </MenuItem>
        ),
        allowDelete && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_DELETE)}
                id={build(baseId, ids.MENUITEM_DELETE)}
                onClick={() => {
                    onClose();
                    handleDelete(selectedAnalyses);
                }}
            >
                <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("delete")} />
            </MenuItem>
        ),
        isMobile && (
            <MenuItem
                key={build(baseId, ids.MENUITEM_FILTER)}
                id={build(baseId, ids.MENUITEM_FILTER)}
                onClick={() => {
                    onClose();
                    onFilterSelected();
                }}
            >
                <ListItemIcon>
                    <FilterList fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("filterLbl")} />
            </MenuItem>
        ),
    ];
}

function AnalysesDotMenu({
    ButtonProps,
    username,
    getSelectedAnalyses,
    ...props
}) {
    // These props need to be spread down into DotMenuItems below.
    const { baseId, isSingleSelection } = props;

    const selectedAnalyses = getSelectedAnalyses ? getSelectedAnalyses() : null;

    let isBatch = false,
        isVICE = false,
        allowTimeExtn = false,
        allowCancel = false,
        allowDelete = false,
        allowRelaunch = false,
        allowEdit = false;

    if (selectedAnalyses) {
        if (isSingleSelection) {
            allowEdit = allowAnalysisEdit(selectedAnalyses[0], username);
            isBatch = isBatchAnalysis(selectedAnalyses[0]);
            isVICE = isInteractive(selectedAnalyses[0]);
            allowTimeExtn = allowAnalysisTimeExtn(
                selectedAnalyses[0],
                username
            );
        }
        allowCancel = allowAnalysesCancel(selectedAnalyses, username);
        allowDelete = allowAnalysesDelete(selectedAnalyses, username);
        allowRelaunch = allowAnalysesRelaunch(selectedAnalyses);
    }

    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={ButtonProps}
            render={(onClose) => (
                <DotMenuItems
                    {...props}
                    isBatch={isBatch}
                    isVICE={isVICE}
                    allowTimeExtn={allowTimeExtn}
                    allowCancel={allowCancel}
                    allowDelete={allowDelete}
                    allowRelaunch={allowRelaunch}
                    allowEdit={allowEdit}
                    onClose={onClose}
                    selectedAnalyses={selectedAnalyses}
                />
            )}
        />
    );
}
export default AnalysesDotMenu;
