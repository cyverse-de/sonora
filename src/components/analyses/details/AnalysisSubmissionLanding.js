import React from "react";
import Link from "next/link";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { useTranslation } from "i18n";

import ids from "../ids";
import buildID from "components/utils/DebugIDUtil";

import { useConfig } from "contexts/config";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";
import DotMenu from "components/dotMenu/DotMenu";

import TerminateAnalysisDialog from "components/analyses/toolbar/TerminateAnalysisDialog";
import RenameAnalysisDialog from "../RenameAnalysisDialog";
import AnalysisCommentDialog from "../AnalysisCommentDialog";

import Sharing from "components/sharing";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import { formatSharedAnalyses } from "components/sharing/util";
import shareIds from "components/sharing/ids";

import analysisStatus from "components/models/analysisStatus";
import { cancelAnalysis } from "serviceFacades/analyses";

import {
    ANALYSES_LISTING_QUERY_KEY,
    getAnalysis,
    useAnalysisInfo,
    useAnalysisParameters,
    renameAnalysis,
    updateAnalysisComment,
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
    Accordion,
    AccordionSummary,
    AccordionDetails,
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
    Launch as LaunchIcon,
    Edit as RenameIcon,
    UnfoldMore as UnfoldMoreIcon,
    Refresh,
    Cancel as CancelIcon,
    Comment as CommentIcon,
    ContactSupport,
    ExpandMore,
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
        isTerminatedAnalysis,
        handleRefresh,
    } = props;

    const { t } = useTranslation("analyses");
    const [href, as] = useRelaunchLink(analysis);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        analysis?.resultfolderid
    );
    const interactiveUrls = analysis?.interactive_urls;

    return [
        <MenuItem
            key={buildID(baseId, ids.MENU)}
            id={buildID(baseId, ids.MENU)}
            onClick={() => {
                onClose();
                handleRefresh();
            }}
        >
            <ListItemIcon>
                <Refresh fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t("refresh")} />
        </MenuItem>,
        !isTerminatedAnalysis && isVICE && (
            <MenuItem
                key={buildID(baseId, ids.MENU)}
                id={buildID(baseId, ids.MENU)}
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
            {isVICE && (
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
            )}
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
    const [terminateAnalysisDlgOpen, setTerminateAnalysisDlgOpen] =
        React.useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);

    const username = getAnalysisUser(analysis);
    const isBatch = isBatchAnalysis(analysis);
    const isVICE = isInteractive(analysis);
    const allowTimeExtn = allowAnalysisTimeExtn(analysis, username);
    const allowCancel = allowAnalysesCancel([analysis], username);
    const allowRelaunch = allowAnalysesRelaunch([analysis]);
    const allowEdit = allowAnalysisEdit(analysis, username);
    const handleTerminateSelected = () => setTerminateAnalysisDlgOpen(true);
    const isTerminatedAnalysis = isTerminated(analysis);
    const sharable = canShare([analysis]);
    const queryClient = useQueryClient();

    const refreshAnalysis = () => {
        queryClient.invalidateQueries([ANALYSES_LISTING_QUERY_KEY, id]);
    };

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
            id,
            enabled: !!id,
            onSuccess: setHistory,
        });

    const { isFetching: isParamsFetching, error: paramsFetchError } =
        useAnalysisParameters({
            id,
            enabled: !!id,
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

    const { mutate: analysesCancelMutation, isLoading: analysisLoading } =
        useMutation(cancelAnalysis, {
            onSuccess: () => {
                queryClient.invalidateQueries([
                    ANALYSES_LISTING_QUERY_KEY,
                    analysis?.id,
                ]);
                setTerminateAnalysisDlgOpen(false);
            },
            onError: (error) => {
                showErrorAnnouncer(
                    t("analysisCancelError", { count: 1 }),
                    error
                );
            },
        });
    const {
        mutate: renameAnalysisMutation,
        isLoading: renameLoading,
        error: renameError,
    } = useMutation(renameAnalysis, {
        onSuccess: (analysis) => {
            refreshAnalysis();
            setRenameDialogOpen(false);
        },
    });

    const {
        mutate: analysisCommentMutation,
        isLoading: commentLoading,
        error: commentError,
    } = useMutation(updateAnalysisComment, {
        onSuccess: (analysis) => {
            refreshAnalysis();
            setCommentDialogOpen(false);
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

    const handleCancel = () => {
        analysesCancelMutation({ id: analysis?.id });
    };

    const handleSaveAndComplete = () => {
        const id = analysis?.id;
        analysesCancelMutation({
            id,
            job_status: analysisStatus.COMPLETED,
        });
    };

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    if (isFetching || isInfoFetching || isParamsFetching || analysisLoading) {
        return <GridLoading rows={25} baseId={baseId} />;
    }

    return (
        <>
            <div
                style={{ margin: theme.spacing(1), padding: theme.spacing(1) }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={isMobile ? 0 : 6}>
                        <Grid container>
                            <Grid item>
                                <Typography variant="h6" color="primary">
                                    {analysis?.name}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={isMobile ? 0 : 6}>
                        <Grid
                            container
                            spacing={1}
                            justifyContent={
                                isMobile ? "flex-start" : "flex-end"
                            }
                        >
                            <Hidden smDown>
                                <Grid item>
                                    <Button
                                        id={buildID(baseId, ids.REFRESH_BTN)}
                                        variant="outlined"
                                        size="small"
                                        disableElevation
                                        color="primary"
                                        onClick={refreshAnalysis}
                                        startIcon={<Refresh />}
                                    >
                                        <Hidden xsDown>{t("refresh")}</Hidden>
                                    </Button>
                                </Grid>
                            </Hidden>
                            <Grid item>
                                {[
                                    analysisStatus.SUBMITTED,
                                    analysisStatus.RUNNING,
                                    analysisStatus.COMPLETED,
                                    analysisStatus.FAILED,
                                ].includes(analysis.status) && (
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
                                    )}
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
                                            handleTerminateSelected={
                                                handleTerminateSelected
                                            }
                                            handleComments={() =>
                                                setCommentDialogOpen(true)
                                            }
                                            handleRename={() =>
                                                setRenameDialogOpen(true)
                                            }
                                            isTerminatedAnalysis={
                                                isTerminatedAnalysis
                                            }
                                            handleRefresh={refreshAnalysis}
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
                <Accordion expanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="subtitle2" color="primary">
                            Status History
                        </Typography>
                    </AccordionSummary>
                    <div style={{ padding: theme.spacing(1) }}>
                        <InfoPanel
                            info={history}
                            isInfoFetching={isInfoFetching}
                            infoFetchError={infoFetchError}
                            baseId={baseId}
                        />
                    </div>
                </Accordion>
                <Accordion expanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="subtitle2" color="primary">
                            Parameters
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ParamsPanel
                            parameters={parameters}
                            isParamsFetching={isParamsFetching}
                            paramsFetchError={paramsFetchError}
                            baseId={baseId}
                        />
                    </AccordionDetails>
                </Accordion>
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
            <TerminateAnalysisDialog
                open={terminateAnalysisDlgOpen}
                onClose={() => setTerminateAnalysisDlgOpen(false)}
                getSelectedAnalyses={() => [analysis]}
                handleSaveAndComplete={handleSaveAndComplete}
                handleCancel={handleCancel}
            />
            <RenameAnalysisDialog
                open={renameDialogOpen}
                selectedAnalysis={analysis}
                isLoading={renameLoading}
                submissionError={renameError}
                onClose={() => setRenameDialogOpen(false)}
                handleRename={renameAnalysisMutation}
            />

            <AnalysisCommentDialog
                open={commentDialogOpen}
                selectedAnalysis={analysis}
                isLoading={commentLoading}
                submissionError={commentError}
                onClose={() => setCommentDialogOpen(false)}
                handleUpdateComment={analysisCommentMutation}
            />
        </>
    );
}
