/**
 * @author johnworth
 *
 * The dashboard component.
 *
 * @module dashboard
 */
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

import { useQueryClient, useQuery, useMutation } from "react-query";
import { useTranslation } from "i18n";

import { Typography } from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";

import ids from "./ids";
import * as constants from "./constants";
import useStyles from "./styles";
import * as fns from "./functions";
import {
    // NewsFeed,
    // EventsFeed,
    RecentlyUsedApps,
    PublicApps,
    PopularFeaturedApps,
    RecentAnalyses,
    //RunningAnalyses,
    VideosFeed,
    InstantLaunches,
} from "./DashboardSection";

import { getDashboard, DASHBOARD_QUERY_KEY } from "serviceFacades/dashboard";
import { useBootstrapInfo } from "contexts/bootstrap";

import { useSavePreferences } from "serviceFacades/users";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { useUserProfile } from "contexts/userProfile";
import Banner from "./dashboardItem/Banner";
import Tour from "./dashboardItem/Tour";
import LegacyDE from "./dashboardItem/LegacyDE";
import TerminateAnalysisDialog from "components/analyses/toolbar/TerminateAnalysisDialog";
import analysisStatus from "components/models/analysisStatus";
import { cancelAnalysis } from "serviceFacades/analyses";

const AppDetailsDrawer = dynamic(() =>
    import("components/apps/details/Drawer")
);
const AnalysesDetailsDrawer = dynamic(() =>
    import("components/analyses/details/Drawer")
);
const PendingTerminationDlg = dynamic(() =>
    import("components/analyses/PendingTerminationDlg")
);

const DashboardSkeleton = () => {
    const classes = useStyles();
    const [userProfile] = useUserProfile();

    let skellyTypes = [classes.sectionNews, classes.sectionEvents, "", ""];

    if (userProfile?.id) {
        skellyTypes = [
            "",
            "",
            "",
            "",
            classes.sectionNews,
            classes.sectionEvents,
            "",
        ];
    }

    const skellies = skellyTypes.map((extraClass, index) => (
        <div className={clsx(classes.section, extraClass)} key={index}>
            <Skeleton
                variant="rect"
                animation="wave"
                height={50}
                width="100%"
            />
            <div className={classes.sectionItems}>
                <Skeleton
                    variant="rect"
                    animation="wave"
                    height={225}
                    width="100%"
                />
            </div>
        </div>
    ));

    return <>{skellies}</>;
};

const Dashboard = (props) => {
    const { showErrorAnnouncer } = props;
    const classes = useStyles();
    const { t } = useTranslation("dashboard");
    const { t: i18nPref } = useTranslation("preferences");
    const { t: i18nIntro } = useTranslation("intro");
    const { t: i18Analyses } = useTranslation("analyses");
    const [userProfile] = useUserProfile();
    const queryClient = useQueryClient();

    const [bootstrapInfo, setBootstrapInfo] = useBootstrapInfo();
    const { mutate: mutatePreferences } = useSavePreferences(
        bootstrapInfo,
        setBootstrapInfo,
        (resp) => {
            announce({
                text: i18nIntro("dismissPrompt"),
                variant: SUCCESS,
            });
        },
        (e) => {
            showErrorAnnouncer(i18nPref("savePrefError"), e);
        }
    );

    const dashboardEl = useRef();
    const [cardWidth, cardHeight, numColumns] = fns.useDashboardSettings({
        dashboardEl,
    });

    const { status, data, error } = useQuery(
        [DASHBOARD_QUERY_KEY, { limit: constants.SECTION_ITEM_LIMIT }],
        () => getDashboard({ limit: constants.SECTION_ITEM_LIMIT })
    );
    const hasErrored = status === "error";

    // Display the error message if an error occurred.
    if (hasErrored) {
        showErrorAnnouncer(t("dashboardInitError", { error: error.message }));
    }

    // State variables.
    const [detailsApp, setDetailsApp] = useState(null);
    const [detailsAnalysis, setDetailsAnalysis] = useState(null);
    const [pendingAnalysis, setPendingAnalysis] = useState(null);
    const [terminateAnalysis, setTerminateAnalysis] = useState(null);

    const [terminateAnalysisDlgOpen, setTerminateAnalysisDlgOpen] =
        React.useState(false);
    const { mutate: analysesCancelMutation, isLoading: analysisLoading } =
        useMutation(cancelAnalysis, {
            onSuccess: () => {
                queryClient.invalidateQueries([
                    DASHBOARD_QUERY_KEY,
                    { limit: constants.SECTION_ITEM_LIMIT },
                ]);
                setTerminateAnalysis(null);
            },
            onError: (error) => {
                showErrorAnnouncer(
                    i18Analyses("analysisCancelError", { count: 1 }),
                    error
                );
                setTerminateAnalysis(null);
            },
        });

    React.useEffect(() => {
        if (terminateAnalysis) {
            setTerminateAnalysisDlgOpen(true);
        }
    }, [terminateAnalysis]);

    const handleCancel = () => {
        analysesCancelMutation({ id: terminateAnalysis?.id });
    };

    const handleSaveAndComplete = () => {
        const id = terminateAnalysis?.id;
        analysesCancelMutation({
            id,
            job_status: analysisStatus.COMPLETED,
        });
    };

    let sections = [
        // new NewsFeed(),
        // new EventsFeed(),
        new VideosFeed(),
        new PopularFeaturedApps(),
        new InstantLaunches(),
    ];

    if (userProfile?.id) {
        sections = [
            new RecentAnalyses(),
            new InstantLaunches(),
            //new RunningAnalyses(),
            new RecentlyUsedApps(),
            new PopularFeaturedApps(),
            new PublicApps(),
            // new NewsFeed(),
            // new EventsFeed(),
            new VideosFeed(),
        ];
    }

    const filteredSections = data
        ? sections
              .filter((section) => data.hasOwnProperty(section.kind))
              .filter((section) => {
                  if (Array.isArray(data[section.kind])) {
                      return data[section.kind].length > 0;
                  } else if (section.name) {
                      return (
                          data[section.kind].hasOwnProperty(section.name) &&
                          data[section.kind][section.name].length > 0
                      );
                  }

                  // If we get here, assume it's an object. Make sure it has properties.
                  return Object.keys(data[section.kind]).length > 0;
              })
              .map((section) =>
                  section.getComponent({
                      t,
                      data,
                      cardWidth,
                      cardHeight,
                      numColumns,
                      showErrorAnnouncer,
                      setDetailsApp,
                      setDetailsAnalysis,
                      setPendingAnalysis,
                      setTerminateAnalysis,
                  })
              )
        : [];

    let componentContent;

    if (filteredSections.length > 0) {
        componentContent = filteredSections;
    } else {
        componentContent = (
            <Typography color="textSecondary">{t("noContentFound")}</Typography>
        );
    }

    // The base ID for the dashboard.
    const baseId = fns.makeID(ids.ROOT);

    const showLegacyCard =
        !userProfile?.id ||
        bootstrapInfo?.preferences?.showLegacyPrompt !== false;

    const isLoading = status === "loading" || analysisLoading;

    return (
        <div ref={dashboardEl} id={baseId} className={classes.gridRoot}>
            {!userProfile?.id && <Banner />}
            {showLegacyCard && (
                <LegacyDE
                    parentId={baseId}
                    onDismiss={() => {
                        const updatedPref = {
                            ...bootstrapInfo.preferences,
                            showLegacyPrompt: false,
                        };
                        mutatePreferences({ preferences: updatedPref });
                    }}
                />
            )}
            {userProfile?.id && bootstrapInfo && (
                <Tour
                    baseId={baseId}
                    showTourPrompt={bootstrapInfo?.preferences?.showTourPrompt}
                    user={userProfile.id}
                    onDismiss={() => {
                        const updatedPref = {
                            ...bootstrapInfo.preferences,
                            showTourPrompt: false,
                        };
                        mutatePreferences({ preferences: updatedPref });
                    }}
                />
            )}
            {isLoading ? <DashboardSkeleton /> : componentContent}

            {detailsApp && (
                <AppDetailsDrawer
                    appId={detailsApp.id}
                    systemId={detailsApp.system_id}
                    open={true}
                    baseId={baseId}
                    onClose={() => setDetailsApp(null)}
                    onFavoriteUpdated={detailsApp.onFavoriteUpdated}
                />
            )}
            {detailsAnalysis && (
                <AnalysesDetailsDrawer
                    selectedAnalysis={detailsAnalysis}
                    baseId={baseId}
                    open={detailsAnalysis !== null}
                    onClose={() => setDetailsAnalysis(null)}
                />
            )}
            {pendingAnalysis && (
                <PendingTerminationDlg
                    open={!!pendingAnalysis}
                    onClose={() => setPendingAnalysis(null)}
                    analysisName={pendingAnalysis?.name}
                    analysisStatus={pendingAnalysis?.status}
                />
            )}
            <div className={classes.footer} />
            {terminateAnalysis && (
                <TerminateAnalysisDialog
                    open={terminateAnalysisDlgOpen}
                    onClose={() => setTerminateAnalysisDlgOpen(false)}
                    getSelectedAnalyses={() => [terminateAnalysis]}
                    handleSaveAndComplete={handleSaveAndComplete}
                    handleCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default withErrorAnnouncer(Dashboard);
