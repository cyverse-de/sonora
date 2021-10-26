import React from "react";
import Link from "next/link";
import { useTranslation } from "i18n";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    ANALYSES_LISTING_QUERY_KEY,
    ANALYSES_SEARCH_QUERY_KEY,
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
import constants from "../../../constants";
import AnalysisCommentDialog from "../AnalysisCommentDialog";
import ids from "../ids";
import RenameAnalysisDialog from "../RenameAnalysisDialog";
import { canShare, openInteractiveUrl } from "../utils";
import DataPathLink from "./DataPathLink";
import InfoPanel from "./InfoPanel";
import ParamsPanel from "./ParamsPanel";

import NavigationConstants from "common/NavigationConstants";
import analysisFields from "components/analyses/analysisFields";
import ShareWithSupportDialog from "components/analyses/ShareWithSupportDialog";
import { OutputFolderMenuItem } from "components/analyses/toolbar/OutputFolderMenuItem";
import { RelaunchMenuItem } from "components/analyses/toolbar/RelaunchMenuItem";
import TerminateAnalysisDialog from "components/analyses/toolbar/TerminateAnalysisDialog";
import {
    allowAnalysesCancel,
    allowAnalysesRelaunch,
    allowAnalysisEdit,
    allowAnalysisTimeExtn,
    getAnalysisUser,
    isBatchAnalysis,
    isInteractive,
    isTerminated,
    useGotoOutputFolderLink,
    useRelaunchLink,
} from "components/analyses/utils";
import { SUCCESS } from "components/announcer/AnnouncerConstants";
import { announce } from "components/announcer/CyVerseAnnouncer";
import DotMenu from "components/dotMenu/DotMenu";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import AnalysesIcon from "components/icons/AnalysesIcon";
import PageWrapper from "components/layout/PageWrapper";
import analysisStatus from "components/models/analysisStatus";
import { useAnalysesSearchInfinite } from "components/search/searchQueries";
import Sharing from "components/sharing";
import shareIds from "components/sharing/ids";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import { formatSharedAnalyses } from "components/sharing/util";
import BasicTable from "components/table/BasicTable";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import CopyLinkButton from "components/utils/CopyLinkButton";
import { copyLinkToClipboardHandler } from "components/utils/copyLinkToClipboardHandler";
import { copyStringToClipboard } from "components/utils/copyStringToClipboard";
import { formatDate } from "components/utils/DateFormatter";
import buildID from "components/utils/DebugIDUtil";
import DELink from "components/utils/DELink";
import { getHost } from "components/utils/getHost";
import GridLabelValue from "components/utils/GridLabelValue";
import GridLoading from "components/utils/GridLoading";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";

import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Grid,
    Hidden,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import {
    Apps,
    Cancel as CancelIcon,
    Comment as CommentIcon,
    ContactSupport,
    Edit as RenameIcon,
    ExpandMore,
    HourglassEmptyRounded as HourGlassIcon,
    Launch as LaunchIcon,
    Refresh,
} from "@material-ui/icons";

const BATCH_LISTING_SIZE = 100;

const InfoGridValue = (props) => <Typography variant="body2" {...props} />;

function DotMenuItems(props) {
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
    } = props;

    const { t } = useTranslation("analyses");
    const [href, as] = useRelaunchLink(analysis);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        analysis?.resultfolderid
    );
    const interactiveUrls = analysis?.interactive_urls;

    return [
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
        </MenuItem>,
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
        <Link
            href={"/" + NavigationConstants.ANALYSES}
            passHref
            key={buildID(baseId, ids.MENUITEM_GOTO_ANALYSES)}
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

function BatchResults(props) {
    const { baseId, parentId, enabled } = props;
    const { t } = useTranslation("analyses");
    const [expandListing, setExpandListing] = React.useState(true);
    let analysisRecordFields = analysisFields(t);

    const {
        status,
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        error,
    } = useAnalysesSearchInfinite(
        [
            ANALYSES_SEARCH_QUERY_KEY,
            {
                rowsPerPage: BATCH_LISTING_SIZE,
                orderBy: analysisRecordFields.START_DATE.key,
                order: constants.SORT_DESCENDING,
                filter: JSON.stringify([
                    { field: "parent_id", value: parentId },
                ]),
            },
        ],
        enabled,
        (lastGroup, allGroups) => {
            const totalPages = Math.ceil(lastGroup?.total / BATCH_LISTING_SIZE);
            if (allGroups.length < totalPages) {
                return allGroups.length;
            } else {
                return false;
            }
        }
    );

    const columns = React.useMemo(
        () => [
            {
                Header: analysisRecordFields.NAME.fieldName,
                accessor: analysisRecordFields.NAME.key,
                Cell: ({ row }) => (
                    <Link
                        href={`/${NavigationConstants.ANALYSES}/${row?.original.id}`}
                    >
                        <DELink
                            id={row?.original.id}
                            text={row?.original.name}
                            title={row?.original.name}
                        />
                    </Link>
                ),
            },
            {
                Header: analysisRecordFields.STATUS.fieldName,
                accessor: analysisRecordFields.STATUS.key,
            },
        ],
        [analysisRecordFields]
    );

    if (error) {
        return (
            <ErrorTypographyWithDialog
                errorMessage={t("errorSearch")}
                errorObject={error}
                baseId={baseId}
            />
        );
    }
    if (
        status !== constants.LOADING &&
        (!data ||
            data.pages.length === 0 ||
            data.pages[0].analyses.length === 0)
    ) {
        return <Typography>{t("noResults")}</Typography>;
    }

    let flatData = [];
    if (data && data.pages[0].analyses.length > 0) {
        data.pages.forEach((page) => {
            flatData = [...flatData, ...page.analyses];
        });
    }

    return (
        <Accordion
            expanded={expandListing}
            onChange={() => setExpandListing(!expandListing)}
        >
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={buildID(baseId, ids.PARAMETERS_PANEL)}
                id={buildID(baseId, ids.PARAMETERS_PANEL)}
            >
                <Typography variant="subtitle2" color="primary">
                    {t("batchDetails")}
                </Typography>
            </AccordionSummary>
            <BasicTable
                baseId={baseId}
                columns={columns}
                data={flatData || []}
                loading={isFetchingNextPage}
                sortable
            />
            <AccordionActions>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ flex: 1 }}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                >
                    {t("loadMore")}
                </Button>
            </AccordionActions>
        </Accordion>
    );
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

    const [expandHistory, setExpandHistory] = React.useState(true);
    const [expandParams, setExpandParams] = React.useState(true);

    const [confirmExtendTimeLimitDlgOpen, setConfirmExtendTimeLimitDlgOpen] =
        React.useState(false);
    const [timeLimitQueryEnabled, setTimeLimitQueryEnabled] =
        React.useState(false);
    const [timeLimit, setTimeLimit] = React.useState();

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

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    if (
        isFetching ||
        isInfoFetching ||
        isParamsFetching ||
        analysisLoading ||
        isFetchingTimeLimit ||
        extensionLoading
    ) {
        return <GridLoading rows={25} baseId={baseId} />;
    }

    return (
        <PageWrapper appBarHeight={75}>
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
                <Accordion
                    expanded={expandHistory}
                    onChange={() => setExpandHistory(!expandHistory)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={buildID(
                            baseId,
                            ids.STATUS_HISTORY_PANEL
                        )}
                        id={buildID(baseId, ids.STATUS_HISTORY_PANEL)}
                    >
                        <Typography variant="subtitle2" color="primary">
                            {t("statusHistory")}
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
                <Accordion
                    expanded={expandParams}
                    onChange={() => setExpandParams(!expandParams)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={buildID(baseId, ids.PARAMETERS_PANEL)}
                        id={buildID(baseId, ids.PARAMETERS_PANEL)}
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
