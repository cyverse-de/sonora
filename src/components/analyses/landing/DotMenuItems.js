import React from "react";
import { useTranslation } from "i18n";
import Link from "next/link";

import NavigationConstants from "common/NavigationConstants";
import { OutputFolderMenuItem } from "components/analyses/toolbar/OutputFolderMenuItem";
import { RelaunchMenuItem } from "components/analyses/toolbar/RelaunchMenuItem";
import {
    useGotoOutputFolderLink,
    useRelaunchLink,
} from "components/analyses/utils";
import AnalysesIcon from "components/icons/AnalysesIcon";
import shareIds from "components/sharing/ids";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import buildID from "components/utils/DebugIDUtil";

import ids from "../ids";
import { openInteractiveUrl } from "../utils";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import {
    Apps,
    Cancel as CancelIcon,
    Comment as CommentIcon,
    Edit as RenameIcon,
    HourglassEmptyRounded as HourGlassIcon,
    Launch as LaunchIcon,
    Refresh,
    ContactSupport,
} from "@mui/icons-material";
import useBreakpoints from "components/layout/useBreakpoints";

export default function DotMenuItems(props) {
    const {
        baseId,
        analysis,
        handleComments,
        handleRename,
        handleTerminateSelected,
        isVICE,
        allowTimeExtn,
        allowCancel,
        allowRelaunch,
        allowEdit,
        onClose,
        canShare,
        setSharingDlgOpen,
        setPendingTerminationDlgOpen,
        handleTimeLimitExtnClick,
        isTerminatedAnalysis,
        handleRefresh,
        handleShareWithSupport,
        allowShareWithSupport,
    } = props;

    const { t } = useTranslation("analyses");
    const [href, as] = useRelaunchLink(analysis);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        analysis?.resultfolderid
    );
    const interactiveUrls = analysis?.interactive_urls;
    const { isMdDown } = useBreakpoints();
    return [
        isMdDown && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_REFRESH)}
                id={buildID(baseId, ids.MENUITEM_REFRESH)}
                onClick={() => {
                    onClose();
                    handleRefresh();
                }}
            >
                <ListItemIcon>
                    <Refresh fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("refresh")} />
            </MenuItem>
        ),
        allowShareWithSupport && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_SHARE_WITH_SUPPORT)}
                id={buildID(baseId, ids.MENUITEM_SHARE_WITH_SUPPORT)}
                onClick={() => {
                    onClose();
                    handleShareWithSupport();
                }}
            >
                <ListItemIcon>
                    <ContactSupport fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("requestHelp")} />
            </MenuItem>
        ),
        !isTerminatedAnalysis && isVICE && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_GOTO_VICE)}
                id={buildID(baseId, ids.MENUITEM_GOTO_VICE)}
                onClick={() => {
                    onClose();
                    openInteractiveUrl(interactiveUrls[0]);
                }}
            >
                <ListItemIcon>
                    <LaunchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("goToVice")} />
            </MenuItem>
        ),
        canShare && (
            <SharingMenuItem
                key={buildID(baseId, shareIds.SHARING_MENU_ITEM)}
                baseId={baseId}
                onClose={onClose}
                setSharingDlgOpen={setSharingDlgOpen}
            />
        ),
        <Link
            href={outputFolderHref}
            as={outputFolderAs}
            passHref
            key={buildID(baseId, ids.MENUITEM_GO_TO_FOLDER)}
            legacyBehavior
        >
            <OutputFolderMenuItem
                baseId={baseId}
                analysis={analysis}
                onClose={onClose}
                setPendingTerminationDlgOpen={setPendingTerminationDlgOpen}
            />
        </Link>,
        allowRelaunch && (
            <Link
                href={href}
                as={as}
                passHref
                key={buildID(baseId, ids.MENUITEM_RELAUNCH)}
                legacyBehavior
            >
                <RelaunchMenuItem baseId={baseId} />
            </Link>
        ),
        allowEdit && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_RENAME)}
                id={buildID(baseId, ids.MENUITEM_RENAME)}
                onClick={() => {
                    onClose();
                    handleRename(analysis);
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
                    handleComments(analysis);
                }}
            >
                <ListItemIcon>
                    <CommentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("updateComments")} />
            </MenuItem>
        ),
        isMdDown && allowTimeExtn && (
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
            </MenuItem>
        ),
        isMdDown && allowCancel && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_CANCEL)}
                id={buildID(baseId, ids.MENUITEM_CANCEL)}
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
        <Link
            href={"/" + NavigationConstants.ANALYSES}
            passHref
            key={buildID(baseId, ids.MENUITEM_GOTO_ANALYSES)}
            legacyBehavior
        >
            <MenuItem id={buildID(baseId, ids.MENUITEM_GOTO_ANALYSES)}>
                <ListItemIcon>
                    <AnalysesIcon
                        fontSize="large"
                        style={{ fontSize: "1.5rem" }}
                    />
                </ListItemIcon>
                <ListItemText primary={t("goToAnalysesListing")} />
            </MenuItem>
        </Link>,
        <Link
            href={"/" + NavigationConstants.APPS}
            passHref
            key={buildID(baseId, ids.MENUITEM_GOTO_APPS)}
            legacyBehavior
        >
            <MenuItem
                id={buildID(baseId, ids.MENUITEM_GOTO_APPS)}
                onClick={() => {
                    onClose();
                }}
            >
                <ListItemIcon>
                    <Apps />
                </ListItemIcon>
                <ListItemText primary={t("goToAppsListing")} />
            </MenuItem>
        </Link>,
    ];
}
