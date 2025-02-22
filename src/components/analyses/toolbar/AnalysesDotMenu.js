/**
 * @author sriram
 *
 * A dot menu for Analyses View.
 *
 */

import React from "react";
import { useTranslation } from "i18n";
import Link from "next/link";
import { useQuery } from "react-query";

import ids from "../ids";

import {
    allowAnalysesCancel,
    allowAnalysesDelete,
    allowAnalysesRelaunch,
    allowAnalysisEdit,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
    isInteractive,
    isInteractiveRunning,
    useGotoOutputFolderLink,
    useRelaunchLink,
} from "../utils";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";
import { OutputFolderMenuItem } from "./OutputFolderMenuItem";
import { RelaunchMenuItem } from "./RelaunchMenuItem";

import {
    VICE_TIME_LIMIT_QUERY_KEY,
    getTimeLimitForVICEAnalysis,
} from "serviceFacades/analyses";

import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@mui/material";

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
} from "@mui/icons-material";
import SharingMenuItem from "../../sharing/SharingMenuItem";
import shareIds from "components/sharing/ids";

import { useConfig } from "contexts/config";
import useBreakpoints from "components/layout/useBreakpoints";

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
        timeLimit,
        setVICELogsDlgOpen,
    } = props;
    const { t } = useTranslation("analyses");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [href, as] = useRelaunchLink(selectedAnalyses[0]);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        selectedAnalyses[0]?.resultfolderid
    );
    const { isMdUp } = useBreakpoints();

    return [
        !isMdUp && allowCancel && (
            <MenuItem
                id={buildID(baseId, ids.MENUITEM_CANCEL)}
                key={buildID(baseId, ids.MENUITEM_CANCEL)}
                onClick={() => {
                    onClose();
                    handleTerminateSelected();
                }}
            >
                <ListItemIcon>
                    <CancelIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("terminate")} />
            </MenuItem>
        ),
        !isMdUp && isSingleSelection && (
            <MenuItem
                id={buildID(baseId, ids.MENUITEM_DETAILS)}
                key={buildID(baseId, ids.MENUITEM_DETAILS)}
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
        !isMdUp && canShare && (
            <SharingMenuItem
                key={buildID(baseId, shareIds.SHARING_MENU_ITEM)}
                baseId={baseId}
                onClose={onClose}
                setSharingDlgOpen={setSharingDlgOpen}
            />
        ),
        isSingleSelection && (
            <Link
                key={buildID(baseId, ids.MENUITEM_GO_TO_FOLDER)}
                href={outputFolderHref}
                as={outputFolderAs}
                passHref
                legacyBehavior
            >
                <OutputFolderMenuItem
                    baseId={baseId}
                    analysis={selectedAnalyses[0]}
                    onClose={onClose}
                    setPendingTerminationDlgOpen={setPendingTerminationDlgOpen}
                />
            </Link>
        ),
        isSingleSelection && allowRelaunch && (
            <Link
                key={buildID(baseId, ids.MENUITEM_RELAUNCH)}
                href={href}
                as={as}
                passHref
                legacyBehavior
            >
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
                    handleTimeLimitExtnClick(timeLimit);
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
    showErrorAnnouncer,
    ...props
}) {
    // These props need to be spread down into DotMenuItems below.
    const { baseId, isSingleSelection } = props;
    const { t } = useTranslation(["analyses", "common"]);

    const [config] = useConfig();

    const [timeLimit, setTimeLimit] = React.useState();

    const selectedAnalyses = getSelectedAnalyses ? getSelectedAnalyses() : null;
    const analysis = isSingleSelection && selectedAnalyses[0];

    let isBatch = false,
        isVICE = false,
        allowTimeExtn = false,
        allowCancel = false,
        allowDelete = false,
        allowRelaunch = false,
        allowEdit = false;

    if (selectedAnalyses) {
        if (isSingleSelection) {
            allowEdit = allowAnalysisEdit(analysis, username, config);
            isBatch = isBatchAnalysis(analysis);
            isVICE = isInteractive(analysis);
            allowTimeExtn =
                timeLimit && allowAnalysisTimeExtn(analysis, username, config);
        }
        allowCancel = allowAnalysesCancel(selectedAnalyses, username, config);
        allowDelete = allowAnalysesDelete(selectedAnalyses, username, config);
        allowRelaunch = allowAnalysesRelaunch(selectedAnalyses);
    }

    useQuery({
        queryKey: [VICE_TIME_LIMIT_QUERY_KEY, analysis?.id],
        queryFn: () => getTimeLimitForVICEAnalysis(analysis?.id),
        enabled: !!analysis?.id && isInteractiveRunning(analysis),
        onSuccess: (resp) => {
            //convert the response from seconds to milliseconds
            setTimeLimit(resp?.time_limit * 1000 || null);
        },
        onError: (error) => {
            showErrorAnnouncer(t("timeLimitError"), error);
        },
    });

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
                    timeLimit={timeLimit}
                />
            )}
        />
    );
}

export default withErrorAnnouncer(AnalysesDotMenu);
