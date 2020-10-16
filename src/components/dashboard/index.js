/**
 * @author johnworth
 *
 * The dashboard component.
 *
 * @module dashboard
 */
import React, { useRef, useState } from "react";

import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import { Typography } from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import ids from "./ids";
import * as constants from "./constants";
import useStyles from "./styles";
import * as fns from "./functions";
import {
    NewsFeed,
    EventsFeed,
    RecentlyAddedApps,
    PublicApps,
    RecentAnalyses,
    RunningAnalyses,
    VideosFeed,
} from "./DashboardSection";

import AppDetailsDrawer from "components/apps/details/Drawer";
import {
    getDashboard,
    DASHBOARD_QUERY_KEY,
} from "../../serviceFacades/dashboard";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

const DashboardSkeleton = () => {
    const classes = useStyles();
    const numSkellies = [0, 1, 2];
    const skellies = numSkellies.map((n) => (
        <div className={classes.section} key={n}>
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

    return <div id={fns.makeID(ids.LOADING)}>{skellies}</div>;
};

const Dashboard = (props) => {
    const { showErrorAnnouncer } = props;
    const classes = useStyles();
    const { t } = useTranslation("dashboard");

    const dashboardEl = useRef();
    const [cardWidth, cardHeight, numColumns] = fns.useDashboardSettings({
        dashboardEl,
    });

    const { status, data, error } = useQuery(
        [DASHBOARD_QUERY_KEY, { limit: constants.SECTION_ITEM_LIMIT }],
        getDashboard
    );
    const isLoading = status === "loading";
    const hasErrored = status === "error";

    // State variables.
    const [detailsApp, setDetailsApp] = useState(null);

    // TODO: Unify error handling across components, somehow.
    if (hasErrored) {
        console.log(error.message);
    }

    const sections = [
        new NewsFeed(),
        new EventsFeed(),
        new VideosFeed(),
        new RecentAnalyses(),
        new RunningAnalyses(),
        new RecentlyAddedApps(),
        new PublicApps(),
    ];

    const filteredSections = data
        ? sections
              .filter(
                  (section) =>
                      data.hasOwnProperty(section.kind) &&
                      data[section.kind].hasOwnProperty(section.name)
              )
              .filter((section) => data[section.kind][section.name].length > 0)
              .map((section, index) =>
                  section.getComponent({
                      t,
                      data,
                      cardWidth,
                      cardHeight,
                      numColumns,
                      showErrorAnnouncer,
                      setDetailsApp,
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

    return (
        <div ref={dashboardEl} id={baseId} className={classes.gridRoot}>
            {isLoading ? <DashboardSkeleton /> : componentContent}
            {detailsApp && (
                <AppDetailsDrawer
                    appId={detailsApp.id}
                    systemId={detailsApp.system_id}
                    open={true}
                    baseId={baseId}
                    onClose={() => setDetailsApp(null)}
                />
            )}
            <div className={classes.footer} />
        </div>
    );
};

export default withErrorAnnouncer(Dashboard);
