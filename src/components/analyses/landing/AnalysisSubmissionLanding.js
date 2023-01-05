import React from "react";

import { useTranslation } from "i18n";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    ANALYSES_LISTING_QUERY_KEY,
    cancelAnalysis,
    extendVICEAnalysisTimeLimit,
    getAnalysis,
    getTimeLimitForVICEAnalysis,
    renameAnalysis,
    updateAnalysisComment,
    useAnalysisInfo,
    useAnalysisParameters,
    VICE_TIME_LIMIT_QUERY_KEY,
} from "serviceFacades/analyses";
import { getAnalysisShareWithSupportRequest } from "serviceFacades/sharing";
import {
    analysisSupportRequest,
    submitAnalysisSupportRequest,
} from "serviceFacades/support";
import BatchResults from "./BatchResults";
import DotMenuItems from "./DotMenuItems";
import AnalysisCommentDialog from "../AnalysisCommentDialog";
import ids from "../ids";
import RenameAnalysisDialog from "../RenameAnalysisDialog";
import { canShare } from "../utils";
import DetailsPanel from "../details/DetailsPanel";
import InfoPanel from "../details/InfoPanel";
import ParamsPanel from "../details/ParamsPanel";
import AnalysisStatusIcon from "../AnalysisStatusIcon";

import ShareWithSupportDialog from "components/analyses/ShareWithSupportDialog";
import TerminateAnalysisDialog from "components/analyses/TerminateAnalysisDialog";
import NotificationCategory from "components/models/NotificationCategory";
import {
    allowAnalysesCancel,
    allowAnalysesRelaunch,
    allowAnalysisEdit,
    allowAnalysisTimeExtn,
    getAnalysisUser,
    isBatchAnalysis,
    isInteractive,
    isTerminated,
} from "components/analyses/utils";

import { SUCCESS } from "components/announcer/AnnouncerConstants";
import { announce } from "components/announcer/CyVerseAnnouncer";
import DotMenu from "components/dotMenu/DotMenu";
import ErrorTypography from "components/error/ErrorTypography";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import PageWrapper from "components/layout/PageWrapper";
import analysisStatus from "components/models/analysisStatus";
import Sharing from "components/sharing";
import { formatSharedAnalyses } from "components/sharing/util";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import { formatDate } from "components/utils/DateFormatter";
import buildID from "components/utils/DebugIDUtil";
import GridLoading from "components/utils/GridLoading";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import { useNotifications } from "contexts/pushNotifications";
import AnalysisSubheader from "components/dashboard/dashboardItem/AnalysisSubheader";
import { BATCH_DRILL_DOWN } from "pages/analyses/[analysisId]";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Divider,
    Grid,
    Hidden,
    Typography,
    useTheme,
} from "@material-ui/core";
import {
    ContactSupport,
    ExpandMore,
    Refresh,
    Launch,
} from "@material-ui/icons";
import BackButton from "components/utils/BackButton";
import PendingTerminationDlg from "components/analyses/PendingTerminationDlg";
import { openInteractiveUrl } from "../utils";

export default function AnalysisSubmissionLanding(props) {
    const { id, baseId, view, showErrorAnnouncer } = props;
    const { t } = useTranslation("analyses");
    const theme = useTheme();
    const [userProfile] = useUserProfile();
    const [config] = useConfig();
    const { currentNotification } = useNotifications();

    const [analysis, setAnalysis] = React.useState();
    const [helpOpen, setHelpOpen] = React.useState(false);
    const [history, setHistory] = React.useState(null);
    const [parameters, setParameters] = React.useState(null);
    const [sharingDlgOpen, setSharingDlgOpen] = React.useState(false);
    const [terminateAnalysisDlgOpen, setTerminateAnalysisDlgOpen] =
        React.useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
    const [commentDialogOpen, setCommentDialogOpen] = React.useState(false);

    const [confirmExtendTimeLimitDlgOpen, setConfirmExtendTimeLimitDlgOpen] =
        React.useState(false);
    const [timeLimitQueryEnabled, setTimeLimitQueryEnabled] =
        React.useState(false);
    const [timeLimit, setTimeLimit] = React.useState();
    const [pendingTerminationDlgOpen, setPendingTerminationDlgOpen] =
        React.useState(false);

    const username = getAnalysisUser(analysis, config);
    const isBatch = isBatchAnalysis(analysis);
    const isVICE = isInteractive(analysis);
    const allowTimeExtn = allowAnalysisTimeExtn(analysis, username, config);
    const allowCancel = allowAnalysesCancel([analysis], username, config);
    const allowRelaunch = allowAnalysesRelaunch([analysis]);
    const allowEdit = allowAnalysisEdit(analysis, username, config);
    const allowShareWithSupport = [
        analysisStatus.SUBMITTED,
        analysisStatus.RUNNING,
        analysisStatus.COMPLETED,
        analysisStatus.FAILED,
    ].includes(analysis?.status);

    const handleTerminateSelected = () => setTerminateAnalysisDlgOpen(true);
    const isTerminatedAnalysis = isTerminated(analysis);
    const sharable = analysis ? canShare([analysis]) : false;
    const interactiveUrls = analysis?.interactive_urls;
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const message = currentNotification?.message;
        if (message) {
            const category = message.type;
            if (
                category?.toLowerCase() ===
                NotificationCategory.ANALYSIS.toLowerCase()
            ) {
                const analysisId = message.payload?.id;
                const status = message.payload?.status;
                const resultfolderid = message.payload?.analysisresultsfolder;
                const enddate = message.payload?.enddate;

                if (analysisId === id && analysis?.status !== status) {
                    setAnalysis({
                        ...analysis,
                        resultfolderid,
                        status,
                        enddate,
                    });
                }
            }
        }
    }, [analysis, currentNotification, id]);

    const refreshAnalysis = () => {
        queryClient.invalidateQueries([ANALYSES_LISTING_QUERY_KEY, id]);
    };

    const { isFetching, error: analysisFetchError } = useQuery({
        queryKey: [ANALYSES_LISTING_QUERY_KEY, id],
        queryFn: () => getAnalysis(id),
        enabled: !!id,
        onSuccess: (data) => {
            //if the analysis not found a give id, an empty list is returned.
            if (data?.analyses?.length > 0) {
                setAnalysis(data?.analyses[0]);
            }
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

    const { isFetching: isFetchingTimeLimit } = useQuery({
        queryKey: [VICE_TIME_LIMIT_QUERY_KEY, id],
        queryFn: () => getTimeLimitForVICEAnalysis(id),
        enabled: timeLimitQueryEnabled,
        onSuccess: (resp) => {
            //convert the response from seconds to milliseconds
            setTimeLimit({
                [id]: formatDate(resp?.time_limit * 1000),
            });
            setConfirmExtendTimeLimitDlgOpen(true);
        },
        onError: (error) => {
            showErrorAnnouncer(t("timeLimitError"), error);
        },
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

    const { mutate: doTimeLimitExtension, isLoading: extensionLoading } =
        useMutation(extendVICEAnalysisTimeLimit, {
            onSuccess: (resp) => {
                setConfirmExtendTimeLimitDlgOpen(false);
                setTimeLimit(null);
                //convert the response from seconds to milliseconds
                announce({
                    text: t("timeLimitExtended", {
                        newTimeLimit: formatDate(resp?.time_limit * 1000),
                        analysisName: analysis?.name,
                    }),
                    variant: SUCCESS,
                });
            },
            onError: (error) => {
                showErrorAnnouncer(t("analysesRelaunchError"), error);
            },
        });

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

    const busy =
        isFetching ||
        analysisLoading ||
        isFetchingTimeLimit ||
        extensionLoading;

    if (busy) {
        return <GridLoading rows={25} baseId={baseId} />;
    }

    if (analysisFetchError) {
        return (
            <WrappedErrorHandler
                errorObject={analysisFetchError}
                baseId={baseId}
            />
        );
    }

    //if the analysis not found for a give id, analysis will be null/undefined.
    if (!analysis && !busy) {
        return <ErrorTypography errorMessage={t("analysisNotFound")} />;
    }

    return (
        <PageWrapper appBarHeight={75}>
            <div
                style={{
                    margin: theme.spacing(0.2),
                    padding: theme.spacing(0.2),
                }}
            >
                {view === BATCH_DRILL_DOWN && <BackButton />}
                <Grid container spacing={1}>
                    <Grid item>
                        <Grid container spacing={1}>
                            <Grid item>
                                <AnalysisStatusIcon status={analysis?.status} />
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant={"subtitle2"}
                                    color="primary"
                                >
                                    {analysis?.name}
                                </Typography>
                                <AnalysisSubheader
                                    analysis={analysis}
                                    date={formatDate(analysis?.startdate)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={1}>
                            <Hidden smDown>
                                {isVICE && !isTerminatedAnalysis && (
                                    <Grid item>
                                        <Button
                                            id={buildID(
                                                baseId,
                                                ids.REFRESH_BTN
                                            )}
                                            variant="outlined"
                                            size="small"
                                            disableElevation
                                            color="primary"
                                            onClick={() =>
                                                openInteractiveUrl(
                                                    interactiveUrls[0]
                                                )
                                            }
                                            startIcon={<Launch />}
                                        >
                                            <Hidden xsDown>
                                                {t("goToVice")}
                                            </Hidden>
                                        </Button>
                                    </Grid>
                                )}
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
                                <Grid item>
                                    {allowShareWithSupport && (
                                        <Button
                                            id={buildID(
                                                baseId,
                                                ids.SHARE_WITH_SUPPORT
                                            )}
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
                            </Hidden>
                            <Grid item>
                                <DotMenu
                                    baseId={buildID(
                                        baseId,
                                        ids.ANALYSIS_DOT_MENU
                                    )}
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
                                            handleTimeLimitExtnClick={() => {
                                                setTimeLimitQueryEnabled(true);
                                            }}
                                            handleShareWithSupport={() =>
                                                setHelpOpen(true)
                                            }
                                            allowShareWithSupport={
                                                allowShareWithSupport
                                            }
                                            setPendingTerminationDlgOpen={
                                                setPendingTerminationDlgOpen
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider />
                <DetailsPanel baseId={baseId} analysis={analysis} />
                <Accordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={buildID(
                            baseId,
                            ids.STATUS_HISTORY_PANEL
                        )}
                        id={buildID(baseId, ids.STATUS_HISTORY_PANEL_HEADER)}
                    >
                        <Typography variant="subtitle2" color="primary">
                            {t("statusHistory")}
                        </Typography>
                    </AccordionSummary>
                    <div
                        style={{ padding: theme.spacing(1) }}
                        id={buildID(baseId, ids.STATUS_HISTORY_PANEL)}
                    >
                        <InfoPanel
                            info={history}
                            isInfoFetching={isInfoFetching}
                            infoFetchError={infoFetchError}
                            baseId={baseId}
                        />
                    </div>
                </Accordion>
                <Accordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={buildID(baseId, ids.PARAMETERS_PANEL)}
                        id={buildID(baseId, ids.PARAMETERS_PANEL_HEADER)}
                    >
                        <Typography variant="subtitle2" color="primary">
                            {t("analysisParams")}
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

                {isBatch && (
                    <BatchResults
                        baseId={baseId}
                        parentId={id}
                        enabled={isBatch}
                    />
                )}
                <Typography variant="caption">
                    {t("landingPageFootNote")}
                </Typography>
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
            <PendingTerminationDlg
                open={pendingTerminationDlgOpen}
                onClose={() => setPendingTerminationDlgOpen(false)}
                analysisName={analysis?.name}
                analysisStatus={analysis?.status}
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
            <ConfirmationDialog
                open={confirmExtendTimeLimitDlgOpen}
                onClose={() => setConfirmExtendTimeLimitDlgOpen(false)}
                onConfirm={() => doTimeLimitExtension({ id })}
                confirmButtonText={t("extend")}
                title={t("extendTime")}
                contentText={t("extendTimeLimitMessage", {
                    timeLimit: timeLimit ? timeLimit[id] : "",
                })}
            />
        </PageWrapper>
    );
}
