/**
 * @author sriram
 *
 * A dot menu for Analyses View.
 *
 */

import React from "react";

import ids from "../ids";
import messages from "../messages";
import {
    isInteractive,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
} from "../utils";

import { build, DotMenu, getMessage, withI18N } from "@cyverse-de/ui-lib";
import { ListItemIcon, ListItemText, MenuItem } from "@material-ui/core";

import {
    Info,
    HourglassEmptyRounded as HourGlassIcon,
    Launch as LaunchIcon,
    PermMedia as OutputFolderIcon,
    Repeat as RelaunchIcon,
    UnfoldMore as UnfoldMoreIcon,
} from "@material-ui/icons";

function AnalysesDotMenu(props) {
    const {
        baseId,
        ButtonProps,
        username,
        onDetailsSelected,
        detailsEnabled,
        selected,
        getSelectedAnalyses,
        handleInteractiveUrlClick,
        handleGoToOutputFolder,
        handleBatchIconClick,
    } = props;

    const isSingleSelection = selected?.length === 1;
    const selectedAnalyses = getSelectedAnalyses ? getSelectedAnalyses() : null;

    let isBatch = false,
        isVICE = false,
        allowTimeExtn = false,
        allowRelaunch = false;

    if (isSingleSelection && selectedAnalyses) {
        isBatch = isBatchAnalysis(selectedAnalyses[0]);
        isVICE = isInteractive(selectedAnalyses[0]);
        allowTimeExtn = allowAnalysisTimeExtn(selectedAnalyses[0], username);
        allowRelaunch = !selectedAnalyses[0]?.app_disabled;
    }

    return (
        <DotMenu
            baseId={baseId}
            ButtonProps={ButtonProps}
            render={(onClose) => [
                detailsEnabled && (
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
                        <ListItemText primary={getMessage("details")} />
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
                        <ListItemText primary={getMessage("goOutputFolder")} />
                    </MenuItem>
                ),
                allowRelaunch && (
                    <MenuItem
                        key={build(baseId, ids.MENUITEM_RELAUNCH)}
                        id={build(baseId, ids.MENUITEM_RELAUNCH)}
                        onClick={() => {
                            onClose();
                        }}
                    >
                        <ListItemIcon>
                            <RelaunchIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={getMessage("relaunch")} />
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
                        <ListItemText primary={getMessage("htDetails")} />
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
                        <ListItemText primary={getMessage("goToVice")} />
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
                        <ListItemText primary={getMessage("extendTime")} />
                    </MenuItem>
                ),
            ]}
        />
    );
}
export default withI18N(AnalysesDotMenu, messages);
