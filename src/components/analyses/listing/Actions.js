/**
 *
 * Row level actions for analysis
 *
 * @author sriram
 *
 **/
import React from "react";
import { useTranslation } from "i18n";
import Link from "next/link";
import ids from "../ids";

import buildID from "components/utils/DebugIDUtil";

import {
    isBatchAnalysis,
    isInteractive,
    isTerminated,
    useGotoOutputFolderLink,
    useRelaunchLink,
} from "../utils";

import { Grid, IconButton } from "@mui/material";
import {
    Cancel as CancelIcon,
    HourglassEmptyRounded as HourGlass,
    Launch as LaunchIcon,
    PermMedia as OutputFolderIcon,
    Repeat as RelaunchIcon,
    UnfoldMore as UnfoldMoreIcon,
    Info,
    Notes as LogsIcon,
} from "@mui/icons-material";

const RelaunchButton = React.forwardRef(function RelaunchButton(props, ref) {
    const { baseId, className, onClick, href } = props;
    const { t } = useTranslation("analyses");
    return (
        <IconButton
            size="small"
            id={buildID(baseId, ids.ICONS.RELAUNCH, ids.BUTTON)}
            className={className}
            href={href}
            onClick={onClick}
            ref={ref}
            color="primary"
            title={t("relaunch")}
        >
            <RelaunchIcon fontSize="small" />
        </IconButton>
    );
});

const GotoOutputFolderButton = React.forwardRef(function GotoOutputFolderButton(
    props,
    ref
) {
    const {
        baseId,
        className,
        href,
        isTerminated,
        setPendingTerminationDlgOpen,
    } = props;
    const { t } = useTranslation("analyses");
    return (
        <IconButton
            size="small"
            id={buildID(baseId, ids.ICONS.OUTPUT, ids.BUTTON)}
            className={className}
            href={href}
            ref={ref}
            onClick={(event) => {
                if (!isTerminated) {
                    event.preventDefault();
                    setPendingTerminationDlgOpen(true);
                    return false;
                }
                // else, do the default link behavior
            }}
            color="primary"
            title={t("goOutputFolder")}
        >
            <OutputFolderIcon fontSize="small" />
        </IconButton>
    );
});

export default function Actions(props) {
    const { t } = useTranslation("analyses");
    const {
        analysis,
        allowBatchDrillDown = true,
        allowCancel,
        allowTimeExtn,
        handleDetailsClick,
        handleInteractiveUrlClick,
        handleTerminateSelected,
        handleBatchIconClick,
        setPendingTerminationDlgOpen,
        baseId,
        handleTimeLimitExtnClick,
        setVICELogsDlgOpen,
    } = props;

    const interactiveUrls = analysis.interactive_urls;
    const isDisabled = analysis.app_disabled;

    const isBatch = isBatchAnalysis(analysis);
    const isVICE = isInteractive(analysis);
    const [relaunchHref, relaunchAs] = useRelaunchLink(analysis);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        analysis?.resultfolderid
    );
    const isTerminatedAnalysis = isTerminated(analysis);

    return (
        <Grid container direction="row" wrap="nowrap">
            {allowCancel && (
                <IconButton
                    size="small"
                    onClick={handleTerminateSelected}
                    id={buildID(baseId, ids.TERMINATE_BTN, ids.BUTTON)}
                    title={t("terminate")}
                >
                    <CancelIcon color="error" fontSize="small" />
                </IconButton>
            )}
            {isTerminatedAnalysis && (
                <Link
                    href={outputFolderHref}
                    as={outputFolderAs}
                    passHref
                    legacyBehavior
                >
                    <GotoOutputFolderButton
                        baseId={baseId}
                        isTerminated={isTerminatedAnalysis}
                        setPendingTerminationDlgOpen={
                            setPendingTerminationDlgOpen
                        }
                    />
                </Link>
            )}
            {isVICE && !isTerminatedAnalysis && (
                <IconButton
                    size="small"
                    onClick={(event) => {
                        setVICELogsDlgOpen(true);
                    }}
                    id={buildID(baseId, ids.ICONS.LOGS, ids.BUTTON)}
                    color="primary"
                    title={t("viewLogs")}
                >
                    <LogsIcon fontSize="small" />
                </IconButton>
            )}
            {allowBatchDrillDown && isBatch && (
                <IconButton
                    size="small"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleBatchIconClick(analysis);
                    }}
                    id={buildID(baseId, ids.ICONS.BATCH, ids.BUTTON)}
                    color="primary"
                    title={t("htDetails")}
                >
                    <UnfoldMoreIcon fontSize="small" />
                </IconButton>
            )}
            {!isDisabled && !isVICE && (
                <Link
                    href={relaunchHref}
                    as={relaunchAs}
                    passHref
                    legacyBehavior
                >
                    <RelaunchButton baseId={baseId} />
                </Link>
            )}
            {isVICE && (
                <IconButton
                    onClick={() =>
                        handleInteractiveUrlClick(interactiveUrls[0])
                    }
                    size="small"
                    id={buildID(baseId, ids.ICONS.INTERACTIVE, ids.BUTTON)}
                    color="primary"
                    title={t("goToVice")}
                >
                    <LaunchIcon fontSize="small" />
                </IconButton>
            )}
            {allowTimeExtn && (
                <IconButton
                    onClick={handleTimeLimitExtnClick}
                    id={buildID(baseId, ids.ICONS.TIME_LIMIT)}
                    size="small"
                    color="primary"
                    title={t("extendTime")}
                >
                    <HourGlass fontSize="small" />
                </IconButton>
            )}
            <IconButton
                onClick={() => handleDetailsClick(analysis)}
                size="small"
                color="primary"
                title={t("details")}
            >
                <Info fontSize="small" />
            </IconButton>
        </Grid>
    );
}
