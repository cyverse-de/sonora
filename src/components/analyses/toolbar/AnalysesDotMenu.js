/**
 * @author sriram
 *
 * A dot menu for Analyses View.
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import Link from "next/link";

import ids from "../ids";
import shareIds from "components/sharing/ids";

import {
    allowAnalysesCancel,
    allowAnalysesDelete,
    allowAnalysesRelaunch,
    allowAnalysisEdit,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
    isInteractive,
    useGotoOutputFolderLink,
    useRelaunchLink,
} from "../utils";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";
import { OutputFolderMenuItem } from "./OutputFolderMenuItem";
import { RelaunchMenuItem } from "./RelaunchMenuItem";
import {
    Hidden,
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import {
    Cancel as CancelIcon,
    Comment as CommentIcon,
    Delete as DeleteIcon,
    Edit as RenameIcon,
    FilterList,
    HourglassEmptyRounded as HourGlassIcon,
    Info,
    Launch as LaunchIcon,
    Queue as AddToBagIcon,
    Repeat as RelaunchIcon,
    UnfoldMore as UnfoldMoreIcon,
    Notes as LogsIcon,
} from "@material-ui/icons";
import SharingMenuItem from "../../sharing/SharingMenuItem";

function DotMenuItems(props) {
    const {
        baseId,
        onDetailsSelected,
        onAddToBagSelected,
        handleComments,
        handleInteractiveUrlClick,
        handleDelete,
        handleRelaunch,
        handleRename,
        handleTerminateSelected,
        handleBatchIconClick,
        hasSelection,
        isBatch,
        isVICE,
        allowTimeExtn,
        allowCancel,
        allowDelete,
        allowRelaunch,
        allowEdit,
        onClose,
        selectedAnalyses,
        canShare,
        setSharingDlgOpen,
        isSingleSelection,
        onFilterSelected,
        setPendingTerminationDlgOpen,
        handleTimeLimitExtnClick,
        setVICELogsDlgOpen,
    } = props;
    const { t } = useTranslation("analyses");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const [href, as] = useRelaunchLink(selectedAnalyses[0]);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        selectedAnalyses[0]?.resultfolderid
    );
    return [
        <Hidden mdUp>
            {isSingleSelection && (
                <MenuItem
                    key={buildID(baseId, ids.MENUITEM_DETAILS)}
                    id={buildID(baseId, ids.MENUITEM_DETAILS)}
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
            )}
            {canShare && (
                <SharingMenuItem
                    key={buildID(baseId, shareIds.SHARING_MENU_ITEM)}
                    baseId={baseId}
                    onClose={onClose}
                    setSharingDlgOpen={setSharingDlgOpen}
                />
            )}
        </Hidden>,
        isSingleSelection && (
            <Link href={outputFolderHref} as={outputFolderAs} passHref>
                <OutputFolderMenuItem
                    baseId={baseId}
                    analysis={selectedAnalyses[0]}
                    onClose={onClose}
                    setPendingTerminationDlgOpen={setPendingTerminationDlgOpen}
                />
            </Link>
        ),
        isSingleSelection && allowRelaunch && (
            <Link href={href} as={as} passHref>
                <RelaunchMenuItem baseId={baseId} />
            </Link>
        ),
        !isSingleSelection && allowRelaunch && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_RELAUNCH)}
                id={buildID(baseId, ids.MENUITEM_RELAUNCH)}
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
                key={buildID(baseId, ids.MENUITEM_RENAME)}
                id={buildID(baseId, ids.MENUITEM_RENAME)}
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
                key={buildID(baseId, ids.MENUITEM_UPDATE_COMMENTS)}
                id={buildID(baseId, ids.MENUITEM_UPDATE_COMMENTS)}
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
                key={buildID(baseId, ids.MENUITEM_BATCH_FILTER)}
                id={buildID(baseId, ids.MENUITEM_BATCH_FILTER)}
                onClick={(event) => {
                    onClose();
                    event.stopPropagation();
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
                key={buildID(baseId, ids.MENUITEM_GOTO_VICE)}
                id={buildID(baseId, ids.MENUITEM_GOTO_VICE)}
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
        allowTimeExtn && [
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_EXTEND_TIME_LIMIT)}
                id={buildID(baseId, ids.MENUITEM_EXTEND_TIME_LIMIT)}
                onClick={() => {
                    onClose();
                    handleTimeLimitExtnClick();
                }}
            >
                <ListItemIcon>
                    <HourGlassIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("extendTime")} />
            </MenuItem>,
            <MenuItem
                id={buildID(baseId, ids.MENUITEM_VIEW_LOGS)}
                key={buildID(baseId, ids.MENUITEM_VIEW_LOGS)}
                onClick={() => {
                    onClose();
                    setVICELogsDlgOpen(true);
                }}
            >
                <ListItemIcon>
                    <LogsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("viewLogs")} />
            </MenuItem>,
        ],
        allowCancel && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_CANCEL)}
                id={buildID(baseId, ids.MENUITEM_CANCEL)}
                onClick={() => {
                    onClose();
                    handleTerminateSelected();
                }}
            >
                <ListItemIcon>
                    <CancelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("terminate")} />
            </MenuItem>
        ),
        allowDelete && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_DELETE)}
                id={buildID(baseId, ids.MENUITEM_DELETE)}
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
                key={buildID(baseId, ids.MENUITEM_FILTER)}
                id={buildID(baseId, ids.MENUITEM_FILTER)}
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
        hasSelection && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_ADD_TO_BAG)}
                id={buildID(baseId, ids.MENUITEM_ADD_TO_BAG)}
                onClick={() => {
                    onClose();
                    onAddToBagSelected();
                }}
            >
                <ListItemIcon>
                    <AddToBagIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("addToBag")} />
            </MenuItem>
        ),
    ];
}

function AnalysesDotMenu({
    ButtonProps,
    username,
    getSelectedAnalyses,
    canShare,
    setSharingDlgOpen,
    setVICELogsDlgOpen,
    ...props
}) {
    // These props need to be spread down into DotMenuItems below.
    const { baseId, isSingleSelection } = props;
    const { t } = useTranslation("common");

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
            buttonText={t("common:dotMenuText")}
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
                    canShare={canShare}
                    setSharingDlgOpen={setSharingDlgOpen}
                    setVICELogsDlgOpen={setVICELogsDlgOpen}
                />
            )}
        />
    );
}

export default AnalysesDotMenu;
