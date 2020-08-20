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
import { build } from "@cyverse-de/ui-lib";

import {
    isInteractive,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
    useRelaunchLink,
    useGotoOutputFolderLink,
} from "../utils";

import { IconButton, makeStyles, Tooltip } from "@material-ui/core";

import {
    HourglassEmptyRounded as HourGlass,
    Launch as LaunchIcon,
    PermMedia as OutputFolderIcon,
    Repeat as RelaunchIcon,
    UnfoldMore as UnfoldMoreIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    action: {
        color: theme.palette.info.main,
        margin: theme.spacing(0.5),
        "&:hover": {
            color: theme.palette.primary.main,
        },
    },
    actionHover: {
        margin: theme.spacing(0.5),
        color: theme.palette.primary.main,
    },
}));

const RelaunchButton = React.forwardRef((props, ref) => {
    const { baseId, className, onClick, href } = props;
    return (
        <IconButton
            size="small"
            id={build(baseId, ids.ICONS.RELAUNCH, ids.BUTTON)}
            className={className}
            href={href}
            onClick={onClick}
            ref={ref}
        >
            <RelaunchIcon fontSize="small" />
        </IconButton>
    );
});

const GotoOutputFolderButton = React.forwardRef((props, ref) => {
    const { baseId, className, onClick, href } = props;
    return (
        <IconButton
            size="small"
            id={build(baseId, ids.ICONS.OUTPUT, ids.BUTTON)}
            className={className}
            href={href}
            onClick={onClick}
            ref={ref}
        >
            <OutputFolderIcon fontSize="small" />
        </IconButton>
    );
});

export default function Actions(props) {
    const classes = useStyles();
    const { t } = useTranslation("analyses");
    const { analysis, allowBatchDrillDown = true } = props;

    const interactiveUrls = analysis.interactive_urls;
    const handleInteractiveUrlClick = props.handleInteractiveUrlClick;
    const handleBatchIconClick = props.handleBatchIconClick;
    const baseId = props.baseId;
    const mouseOverId = props.mouseOverId;
    const username = props.username;
    const isDisabled = analysis.app_disabled;
    const className =
        mouseOverId === analysis.id ? classes.actionHover : classes.action;

    const isBatch = isBatchAnalysis(analysis);
    const isVICE = isInteractive(analysis);
    const allowTimeExtn = allowAnalysisTimeExtn(analysis, username);
    const [href, as] = useRelaunchLink(analysis);
    const [resultHref, resultAs] = useGotoOutputFolderLink(analysis);
    return (
        <>
            <Tooltip
                aria-label={t("goOutputFolder")}
                title={t("goOutputFolder")}
                id={build(baseId, ids.ICONS.OUTPUT, ids.TOOLTIP)}
            >
                <Link href={resultHref} as={resultAs} passHref>
                    <GotoOutputFolderButton
                        baseId={baseId}
                        className={className}
                    />
                </Link>
            </Tooltip>

            {allowBatchDrillDown && isBatch && (
                <Tooltip
                    aria-label={t("htDetails")}
                    title={t("htDetails")}
                    id={build(baseId, ids.ICONS.BATCH, ids.TOOLTIP)}
                >
                    <IconButton
                        size="small"
                        onClick={() => handleBatchIconClick(analysis)}
                        id={build(baseId, ids.ICONS.BATCH, ids.BUTTON)}
                        className={className}
                    >
                        <UnfoldMoreIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            )}
            {!isDisabled && !isVICE && (
                <Tooltip
                    aria-label={t("relaunch")}
                    title={t("relaunch")}
                    id={build(baseId, ids.ICONS.RELAUNCH, ids.TOOLTIP)}
                >
                    <Link href={href} as={as} passHref>
                        <RelaunchButton baseId={baseId} className={className} />
                    </Link>
                </Tooltip>
            )}
            {isVICE && (
                <Tooltip
                    id={build(baseId, ids.ICONS.INTERACTIVE, ids.TOOLTIP)}
                    aria-label={t("goToVice")}
                    title={t("goToVice")}
                >
                    <IconButton
                        onClick={() =>
                            handleInteractiveUrlClick(interactiveUrls[0])
                        }
                        size="small"
                        id={build(baseId, ids.ICONS.INTERACTIVE, ids.BUTTON)}
                        className={className}
                    >
                        <LaunchIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            )}
            {allowTimeExtn && (
                <Tooltip
                    aria-label={t("extendTime")}
                    title={t("extendTime")}
                    id={build(baseId, ids.ICONS.TIME_LIMIT, ids.TOOLTIP)}
                >
                    <IconButton
                        id={build(baseId, ids.ICONS.TIME_LIMIT)}
                        size="small"
                        className={className}
                    >
                        <HourGlass fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </>
    );
}
