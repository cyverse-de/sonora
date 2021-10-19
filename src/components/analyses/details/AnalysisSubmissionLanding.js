import React from "react";
import Link from "next/link";
import { useQuery } from "react-query";
import { useTranslation } from "i18n";
import {
    ANALYSES_LISTING_QUERY_KEY,
    getAnalysis,
} from "serviceFacades/analyses";

import GridLabelValue from "components/utils/GridLabelValue";
import { formatDate } from "components/utils/DateFormatter";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import Drawer from "components/analyses/details/Drawer";
import {
    isTerminated,
    getAnalysisUser,
    isInteractive,
    allowAnalysisTimeExtn,
    isBatchAnalysis,
    useRelaunchLink,
    useGotoOutputFolderLink,
} from "components/analyses/utils";
import { useUserProfile } from "contexts/userProfile";
import ShareWithSupportDialog from "components/analyses/ShareWithSupportDialog";

import NavigationConstants from "common/NavigationConstants";

import {
    Button,
    Grid,
    Typography,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import GridLoading from "components/utils/GridLoading";

const InfoGridValue = (props) => <Typography variant="body2" {...props} />;

export default function AnalysisSubmissionLanding(props) {
    const { id, baseId } = props;
    const { t } = useTranslation("analyses");
    const theme = useTheme();
    const [userProfile] = useUserProfile();

    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const [analysis, setAnalysis] = React.useState();
    const [detailsOpen, setDetailsOpen] = React.useState(false);
    const [helpOpen, setHelpOpen] = React.useState(false);

    const username = getAnalysisUser(analysis);

    const interactiveUrls = analysis?.interactive_urls;
    const isDisabled = analysis?.app_disabled;

    const isBatch = isBatchAnalysis(analysis);
    const isVICE = isInteractive(analysis);
    const allowTimeExtn = allowAnalysisTimeExtn(analysis, username);
    const [relaunchHref, relaunchAs] = useRelaunchLink(analysis);
    const [outputFolderHref, outputFolderAs] = useGotoOutputFolderLink(
        analysis?.resultfolderid
    );
    const isTerminatedAnalysis = isTerminated(analysis);

    const { isFetching, error } = useQuery({
        queryKey: [ANALYSES_LISTING_QUERY_KEY, id],
        queryFn: () => getAnalysis(id),
        enabled: !!id,
        onSuccess: (data) => {
            setAnalysis(data?.analyses[0]);
        },
    });

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
                    <Grid item xs={isMobile ? 12 : 6}>
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
                                <Button
                                    variant="outlined"
                                    onClick={() => setDetailsOpen(true)}
                                >
                                    {t("details")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={() => setHelpOpen(true)}
                                >
                                    {t("requestHelp")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <GridLabelValue label={t("analysisId")}>
                        <InfoGridValue>{analysis?.id}</InfoGridValue>
                    </GridLabelValue>
                    <GridLabelValue label={t("app")}>
                        <InfoGridValue>{analysis?.app_name}</InfoGridValue>
                    </GridLabelValue>
                    <GridLabelValue label={t("currentStatus")}>
                        <InfoGridValue>{analysis?.status}</InfoGridValue>
                    </GridLabelValue>
                    <GridLabelValue label={t("outputFolder")}>
                        <InfoGridValue>
                            {analysis?.resultfolderid}
                        </InfoGridValue>
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
                <Grid
                    container
                    justifyContent="space-evenly"
                    alignItems="stretch"
                    spacing={1}
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
            {detailsOpen && (
                <Drawer
                    selectedAnalysis={analysis}
                    baseId={baseId}
                    open={detailsOpen}
                    onClose={() => setDetailsOpen(false)}
                />
            )}
            {helpOpen && (
                <ShareWithSupportDialog
                    baseId={baseId}
                    open={helpOpen}
                    analysis={analysis}
                    name={userProfile?.attributes.name}
                    email={userProfile?.attributes.email}
                    loading={false}
                    onClose={() => setHelpOpen(false)}
                    onShareWithSupport={null}
                />
            )}
        </>
    );
}
