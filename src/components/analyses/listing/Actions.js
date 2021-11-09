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
    isInteractive,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
    useRelaunchLink,
    useGotoOutputFolderLink,
    isTerminated,
} from "../utils";

import { useConfig } from "contexts/config";

import { IconButton } from "@material-ui/core";
import {
    HourglassEmptyRounded as HourGlass,
    Launch as LaunchIcon,
    PermMedia as OutputFolderIcon,
    Repeat as RelaunchIcon,
    UnfoldMore as UnfoldMoreIcon,
    Info,
} from "@material-ui/icons";

const RelaunchButton = React.forwardRef((props, ref) => {
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

const GotoOutputFolderButton = React.forwardRef((props, ref) => {
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
        handleDetailsClick,
        handleInteractiveUrlClick,
        handleBatchIconClick,
        setPendingTerminationDlgOpen,
        baseId,
        username,
        handleTimeLimitExtnClick,
    } = props;

    const [config] = useConfig();

    const interactiveUrls = analysis.interactive_urls;
    const isDisabled = analysis.app_disabled;

    const isBatch = isBatchAnalysis(analysis);
    const isVICE = isInteractive(analysis);
    const allowTimeExtn = allowAnalysisTimeExtn(analysis, username, config);
    const [relaunchHref, relaunchAs] = useRelaunchLink(analysis);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        analysis?.resultfolderid
    );
    const isTerminatedAnalysis = isTerminated(analysis);
    return (
        <>
            <Link href={outputFolderHref} as={outputFolderAs} passHref>
                <GotoOutputFolderButton
                    baseId={baseId}
                    isTerminated={isTerminatedAnalysis}
                    setPendingTerminationDlgOpen={setPendingTerminationDlgOpen}
                />
            </Link>
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
                <Link href={relaunchHref} as={relaunchAs} passHref>
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
        </>
    );
}
