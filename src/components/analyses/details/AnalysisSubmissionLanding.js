import React from "react";
import Link from "next/link";
import { useQuery, useMutation } from "react-query";
import { useTranslation } from "i18n";

import ids from "../ids";
import buildID from "components/utils/DebugIDUtil";

import { useConfig } from "contexts/config";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";
import DotMenu from "components/dotMenu/DotMenu";

import Sharing from "components/sharing";
import SharingButton from "components/sharing/SharingButton";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import { formatSharedAnalyses } from "components/sharing/util";
import shareIds from "components/sharing/ids";

import {
    ANALYSES_LISTING_QUERY_KEY,
    getAnalysis,
    useAnalysisInfo,
    useAnalysisParameters,
} from "serviceFacades/analyses";

import { getAnalysisShareWithSupportRequest } from "serviceFacades/sharing";
import {
    analysisSupportRequest,
    submitAnalysisSupportRequest,
} from "serviceFacades/support";

import GridLabelValue from "components/utils/GridLabelValue";
import { formatDate } from "components/utils/DateFormatter";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import { getHost } from "components/utils/getHost";

import {
    allowAnalysesCancel,
    allowAnalysesRelaunch,
    allowAnalysisEdit,
    allowAnalysisTimeExtn,
    isTerminated,
    getAnalysisUser,
    isInteractive,
    isBatchAnalysis,
    useRelaunchLink,
    useGotoOutputFolderLink,
} from "components/analyses/utils";
import { useUserProfile } from "contexts/userProfile";
import ShareWithSupportDialog from "components/analyses/ShareWithSupportDialog";
import { OutputFolderMenuItem } from "components/analyses/toolbar/OutputFolderMenuItem";
import { RelaunchMenuItem } from "components/analyses/toolbar/RelaunchMenuItem";
import NavigationConstants from "common/NavigationConstants";
import { copyStringToClipboard } from "components/utils/copyStringToClipboard";
import { copyLinkToClipboardHandler } from "components/utils/copyLinkToClipboardHandler";
import CopyLinkButton from "components/utils/CopyLinkButton";
import { canShare, openInteractiveUrl } from "../utils";

import {
    Button,
    Grid,
    Hidden,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";

import {
    HourglassEmptyRounded as HourGlass,
    Launch as LaunchIcon,
    PermMedia as OutputFolderIcon,
    Repeat as RelaunchIcon,
    Edit as RenameIcon,
    UnfoldMore as UnfoldMoreIcon,
    Info,
    Refresh,
    Cancel as CancelIcon,
    Comment as CommentIcon,
    ContactSupport,
    HourglassEmptyRounded as HourGlassIcon,
} from "@material-ui/icons";

import GridLoading from "components/utils/GridLoading";
import InfoPanel from "./InfoPanel";
import ParamsPanel from "./ParamsPanel";
import DataPathLink from "./DataPathLink";
import constants from "../../../constants";

const InfoGridValue = (props) => <Typography variant="body2" {...props} />;

function DotMenuItems(props) {
    const {
        baseId,
        analysis,
        handleComments,
        handleInteractiveUrlClick,
        handleRename,
        handleTerminateSelected,
        handleBatchIconClick,
        isBatch,
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
    } = props;

    const { t } = useTranslation("analyses");
    const [href, as] = useRelaunchLink(analysis);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        analysis?.resultfolderid
    );

    return [
        canShare && (
            <SharingMenuItem
                key={buildID(baseId, shareIds.SHARING_MENU_ITEM)}
                baseId={baseId}
                onClose={onClose}
                setSharingDlgOpen={setSharingDlgOpen}
            />
        ),
        <Link href={outputFolderHref} as={outputFolderAs} passHref>
            <OutputFolderMenuItem
                baseId={baseId}
                analysis={analysis}
                onClose={onClose}
                setPendingTerminationDlgOpen={setPendingTerminationDlgOpen}
            />
        </Link>,
        allowRelaunch && (
            <Link href={href} as={as} passHref>
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
        isBatch && (
            <MenuItem
                key={buildID(baseId, ids.MENUITEM_BATCH_FILTER)}
                id={buildID(baseId, ids.MENUITEM_BATCH_FILTER)}
                onClick={(event) => {
                    onClose();
                    event.stopPropagation();
                    handleBatchIconClick(analysis);
                }}
            >
                <ListItemIcon>
                    <UnfoldMoreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={t("htDetails")} />
            </MenuItem>
        ),
        <Hidden mdUp>
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
            )
        </Hidden>,
        allowTimeExtn && (
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
        <Link href={"/" + NavigationConstants.ANALYSES} passHref>
            <MenuItem
                key={buildID(baseId, "go to analyses listing")}
                id={buildID(baseId, "go to analyses listing")}
            >
                <ListItemText primary="Go to Analyses Listing" />
            </MenuItem>
        </Link>,
        <Link href={"/" + NavigationConstants.APPS} passHref>
            <MenuItem
                key={buildID(baseId, "go to apps")}
                id={buildID(baseId, "go to apps")}
                onClick={() => {
                    onClose();
                }}
            >
                <ListItemText primary="Go to Apps Listing" />
            </MenuItem>
        </Link>,
    ];
}

export default function AnalysisSubmissionLanding(props) {
    const { id, baseId, showErrorAnnouncer } = props;
    const { t } = useTranslation("analyses");
    const { t: i18nCommon } = useTranslation("common");
    const theme = useTheme();
    const [userProfile] = useUserProfile();
    const [config] = useConfig();

    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const [analysis, setAnalysis] = React.useState();
    const [helpOpen, setHelpOpen] = React.useState(false);
    const [history, setHistory] = React.useState(null);
    const [parameters, setParameters] = React.useState(null);
    const [sharingDlgOpen, setSharingDlgOpen] = React.useState(false);

    const username = getAnalysisUser(analysis);

    const interactiveUrls = analysis?.interactive_urls;
    const isBatch = isBatchAnalysis(analysis);
    const isVICE = isInteractive(analysis);
    const allowTimeExtn = allowAnalysisTimeExtn(analysis, username);
    const allowCancel = allowAnalysesCancel([analysis], username);
    const allowRelaunch = allowAnalysesRelaunch([analysis]);
    const allowEdit = allowAnalysisEdit(analysis, username);
    const [relaunchHref, relaunchAs] = useRelaunchLink(analysis);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        analysis?.resultfolderid
    );
    const isTerminatedAnalysis = isTerminated(analysis);
    const sharable = canShare([analysis]);

    const { isFetching, error } = useQuery({
        queryKey: [ANALYSES_LISTING_QUERY_KEY, id],
        queryFn: () => getAnalysis(id),
        enabled: !!id,
        onSuccess: (data) => {
            setAnalysis(data?.analyses[0]);
        },
    });

    const { isFetching: isInfoFetching, error: infoFetchError } =
        useAnalysisInfo({
            id: analysis?.id,
            enabled: !!analysis?.id,
            onSuccess: setHistory,
        });

    const { isFetching: isParamsFetching, error: paramsFetchError } =
        useAnalysisParameters({
            id: analysis?.id,
            enabled: !!analysis?.id,
            onSuccess: setParameters,
        });

    const { mutate: shareAnalysesMutation, isLoading: shareLoading } =
        useMutation(submitAnalysisSupportRequest, {
            onSuccess: (responses) => {
                announce({
                    text: t("statusHelpShareSuccess"),
                    variant: SUCCESS,
                });
                setHelpOpen(false);
            },
            onError: (error) => {
                showErrorAnnouncer(t("statusHelpShareError"), error);
            },
        });

    const onShareWithSupport = (analysis, comment) => {
        shareAnalysesMutation({
            ...getAnalysisShareWithSupportRequest(
                config?.analysis?.supportUser,
                analysis.id
            ),
            supportRequest: analysisSupportRequest(
                userProfile?.id,
                userProfile?.attributes.email,
                t("statusHelpRequestSubject", {
                    name: userProfile?.attributes.name,
                }),
                comment,
                analysis
            ),
        });
    };

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    if (isFetching) {
        return <GridLoading rows={10} baseId={baseId} />;
    }

    return (
        <>
            <div
                style={{ margin: theme.spacing(1), padding: theme.spacing(1) }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Grid container>
                            <Grid item>
                                <Typography variant="h6" color="primary">
                                    {analysis?.name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 6}>
                        <Grid
                            container
                            spacing={1}
                            justifyContent={
                                isMobile ? "flex-start" : "flex-end"
                            }
                        >
                            <Grid item>
                                {isVICE && !isTerminatedAnalysis && (
                                    <Button
                                        onClick={() =>
                                            openInteractiveUrl(
                                                interactiveUrls[0]
                                            )
                                        }
                                        variant="outlined"
                                        size="small"
                                        id={buildID(
                                            baseId,
                                            ids.ICONS.INTERACTIVE,
                                            ids.BUTTON
                                        )}
                                        color="primary"
                                        title={t("goToVice")}
                                        startIcon={
                                            <LaunchIcon fontSize="small" />
                                        }
                                    >
                                        {t("goToVice")}
                                    </Button>
                                )}
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => setHelpOpen(true)}
                                    size="small"
                                    startIcon={
                                        <ContactSupport fontSize="small" />
                                    }
                                    color="primary"
                                    title={t("requestHelp")}
                                >
                                    {t("requestHelp")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <DotMenu
                                    baseId={baseId}
                                    buttonText={t("common:dotMenuText")}
                                    render={(onClose) => (
                                        <DotMenuItems
                                            isBatch={isBatch}
                                            isVICE={isVICE}
                                            allowTimeExtn={allowTimeExtn}
                                            allowCancel={allowCancel}
                                            allowRelaunch={allowRelaunch}
                                            allowEdit={allowEdit}
                                            onClose={onClose}
                                            analysis={analysis}
                                            canShare={canShare}
                                            setSharingDlgOpen={
                                                setSharingDlgOpen
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <GridLabelValue label={t("app")}>
                        <InfoGridValue>{analysis?.app_name}</InfoGridValue>
                    </GridLabelValue>
                    <GridLabelValue label={t("currentStatus")}>
                        <InfoGridValue>{analysis?.status}</InfoGridValue>
                    </GridLabelValue>
                    <GridLabelValue label={t("outputFolder")}>
                        <div style={{ width: "100%" }}>
                            <div style={{ float: "left" }}>
                                <DataPathLink
                                    id={baseId}
                                    param_type="FolderInput"
                                    path={analysis?.resultfolderid}
                                />
                            </div>
                            <div style={{ marginLeft: theme.spacing(0.25) }}>
                                <CopyLinkButton
                                    baseId={baseId}
                                    onCopyLinkSelected={() => {
                                        const link = `${getHost()}/${
                                            NavigationConstants.DATA
                                        }/${constants.DATA_STORE_STORAGE_ID}${
                                            analysis?.resultfolderid
                                        }`;
                                        const copyPromise =
                                            copyStringToClipboard(link);
                                        copyLinkToClipboardHandler(
                                            i18nCommon,
                                            copyPromise
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </GridLabelValue>
                    <GridLabelValue label={t("startDate")}>
                        <InfoGridValue>
                            {formatDate(analysis?.startdate)}
                        </InfoGridValue>
                    </GridLabelValue>
                    <GridLabelValue label={t("endDate")}>
                        <InfoGridValue>
                            {formatDate(analysis?.enddate)}
                        </InfoGridValue>
                    </GridLabelValue>
                    <GridLabelValue label={t("user")}>
                        <InfoGridValue>{username}</InfoGridValue>
                    </GridLabelValue>
                </Grid>
                <hr />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="primary">
                            Status History
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <InfoPanel
                            info={history}
                            isInfoFetching={isInfoFetching}
                            infoFetchError={infoFetchError}
                            baseId={baseId}
                        />
                    </Grid>
                </Grid>
                <hr />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="primary">
                            Parameters
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ParamsPanel
                            parameters={parameters}
                            isParamsFetching={isParamsFetching}
                            paramsFetchError={paramsFetchError}
                            baseId={baseId}
                        />
                    </Grid>
                </Grid>
                <hr />
                <Grid
                    container
                    justifyContent="space-evenly"
                    alignItems="stretch"
                    spacing={3}
                >
                    {isTerminatedAnalysis && (
                        <Grid item>
                            <Link
                                href={outputFolderHref}
                                as={outputFolderAs}
                                passHref
                            >
                                <Button variant="outlined">
                                    {t("goOutputFolder")}
                                </Button>
                            </Link>
                        </Grid>
                    )}
                    {!isTerminatedAnalysis && (
                        <Grid item>
                            <Button variant="outlined">{t("terminate")}</Button>
                        </Grid>
                    )}
                    <Grid item>
                        <Link href={relaunchHref} as={relaunchAs} passHref>
                            <Button variant="outlined">{t("relaunch")}</Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link
                            href={"/" + NavigationConstants.ANALYSES}
                            passHref
                        >
                            <Button variant="outlined">
                                Go to Analyses Listing
                            </Button>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href={"/" + NavigationConstants.APPS} passHref>
                            <Button variant="outlined">
                                Go to Apps Listing
                            </Button>
                        </Link>
                    </Grid>
                </Grid>
            </div>
            {sharable && (
                <Sharing
                    open={sharingDlgOpen}
                    onClose={() => setSharingDlgOpen(false)}
                    resources={formatSharedAnalyses([analysis])}
                />
            )}
            {helpOpen && (
                <ShareWithSupportDialog
                    baseId={baseId}
                    open={helpOpen}
                    analysis={analysis}
                    name={userProfile?.attributes.name}
                    email={userProfile?.attributes.email}
                    loading={shareLoading}
                    onClose={() => setHelpOpen(false)}
                    onShareWithSupport={onShareWithSupport}
                />
            )}
        </>
    );
}
