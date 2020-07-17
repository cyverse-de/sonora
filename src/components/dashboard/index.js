/**
 * @author johnworth
 *
 * The dashboard component.
 *
 * @module dashboard
 */
import React, { useLayoutEffect, useState, useRef } from "react";

import clsx from "clsx";
import { useQuery } from "react-query";
import { useTranslation } from "i18n";

import { useTheme } from "@material-ui/styles";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Avatar,
    useMediaQuery,
    Link,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import { build as buildID } from "@cyverse-de/ui-lib";

import ids from "./ids";
import * as constants from "./constants";
import useStyles from "./styles";
import * as fns from "./functions";

import {
    getDashboard,
    DASHBOARD_QUERY_KEY,
} from "../../serviceFacades/dashboard";

const useDashboardSettings = ({ width, marginRight = 16, padding = 16 }) => {
    const [columns, setColumns] = useState(5);
    const [cardWidth, setCardWidth] = useState(0);
    const [cardHeight, setCardHeight] = useState(0);

    // This is used because media queries misbehave on the server and this lets
    // us set values before rendering occurs.
    useLayoutEffect(() => {
        let newColumns;

        if (width >= constants.XL_PIXELS) {
            newColumns = constants.XL_NUM_COLUMNS;
        } else if (width >= constants.LG_PIXELS) {
            newColumns = constants.LG_NUM_COLUMNS;
        } else if (width >= constants.MD_PIXELS) {
            newColumns = constants.MD_NUM_COLUMNS;
        } else if (width >= constants.SM_PIXELS) {
            newColumns = constants.SM_NUM_COLUMNS;
        } else if (width >= constants.XS_PIXELS) {
            newColumns = constants.XS_NUM_COLUMNS;
        } else {
            // probably won't get here. probably.
            newColumns = constants.LG_NUM_COLUMNS;
        }
        setColumns(newColumns);

        const cardWidth = Math.floor(
            width / newColumns - marginRight - (padding * 2) / newColumns
        );

        // Try to get a 4:3 ration for width to height
        const cardHeight = Math.floor(cardWidth - cardWidth / 3);

        setCardWidth(cardWidth);
        setCardHeight(cardHeight);
    }, [width, marginRight, setCardWidth, setColumns, padding]);

    return [columns, cardWidth, cardHeight];
};

const DashboardLink = ({ kind, content, headerClass, children }) => {
    const isNewTab =
        kind === constants.KIND_EVENTS || kind === constants.KIND_FEEDS;
    const target = fns.getLinkTarget(kind, content);

    return isNewTab ? (
        <Link
            href={target}
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="always"
            classes={{ root: headerClass }}
        >
            {children}
        </Link>
    ) : (
        <Link
            href={target}
            color="inherit"
            underline="always"
            classes={{ root: headerClass }}
        >
            {children}
        </Link>
    );
};

/**
 * An item in the dashboard.
 *
 * @param {Object} props - The props for the component.
 * @param {String} props.kind - The kind of item. Example: "app" or "analysis".
 * @param {Object} props.content - The content for the item returned from the API.
 * @returns {Object}
 */
export const DashboardItem = ({
    kind,
    content,
    section,
    intl,
    width,
    height,
}) => {
    const classes = useStyles({ width, height });
    const theme = useTheme();
    const { t } = useTranslation("dashboard");

    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

    const cardID = buildID(kind, content.id);

    const description = fns.cleanDescription(content.description);
    const [origination, date] = fns.getOrigination(kind, content);
    const user = fns.cleanUsername(content.username);
    const [headerClass, avatarClass] = fns.getSectionClass(section, classes);
    const rootClass = clsx(classes.cardHeaderDefault, headerClass);

    return (
        <Card
            classes={{ root: classes.dashboardCard }}
            id={fns.makeID(ids.ITEM, cardID)}
            elevation={4}
        >
            <CardHeader
                avatar={
                    isMediumOrLarger && (
                        <Avatar className={classes.avatar}>
                            {fns.getAvatarIcon(kind, avatarClass)}
                        </Avatar>
                    )
                }
                classes={{
                    root: rootClass,
                    content: classes.cardHeaderContent,
                }}
                title={
                    <Typography
                        noWrap={true}
                        variant="h6"
                        color="primary"
                        classes={{ root: classes.cardHeaderText }}
                    >
                        <DashboardLink
                            kind={kind}
                            content={content}
                            headerClass={headerClass}
                        >
                            {content.name}
                        </DashboardLink>
                    </Typography>
                }
                titleTypographyProps={{
                    noWrap: true,
                    variant: "h6",
                    color: "primary",
                    classes: { colorPrimary: classes.cardHeaderText },
                }}
                subheader={
                    <Typography
                        noWrap
                        color="textSecondary"
                        variant="subtitle2"
                        classes={{
                            colorTextSecondary: classes.cardHeaderText,
                        }}
                    >
                        {`${origination} ${user} on ${date}`}
                    </Typography>
                }
            />
            <CardContent
                classes={{
                    root: classes.root,
                }}
            >
                <Typography color="textSecondary" variant="body2" component="p">
                    {description || t("noDescriptionProvided")}
                </Typography>
            </CardContent>

            <CardActions
                classes={{
                    root: classes.actionsRoot,
                }}
            ></CardActions>
        </Card>
    );
};

const DashboardSection = ({ name, kind, items, id, section, t }) => {
    const classes = useStyles();

    const dashboardEl = useRef();

    // Adapted from https://stackoverflow.com/questions/49058890/how-to-get-a-react-components-size-height-width-before-render
    // and https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react/19014495#19014495
    const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

    useLayoutEffect(() => {
        function updater() {
            if (dashboardEl.current) {
                setDimensions({
                    width: dashboardEl.current.offsetWidth,
                    height: dashboardEl.current.offsetHeight,
                });
            }
        }
        window.addEventListener("resize", updater);
        updater();
        return () => window.removeEventListener("resize", updater);
    }, [dashboardEl, setDimensions]);

    const [columns, width, height] = useDashboardSettings(dimensions);

    return (
        <div className={classes.section} id={id}>
            <Typography
                noWrap
                gutterBottom
                variant="h5"
                component="h5"
                color="primary"
            >
                {name}
            </Typography>

            <Divider classes={{ root: classes.dividerRoot }} />

            <div ref={dashboardEl} className={classes.sectionItems}>
                {items.map((item) => (
                    <DashboardItem
                        kind={kind}
                        content={item}
                        key={item.id}
                        section={section}
                        t={t}
                        columns={columns}
                        width={width}
                        height={height}
                    />
                ))}
            </div>
        </div>
    );
};

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

const Dashboard = () => {
    const classes = useStyles();
    const { t } = useTranslation("dashboard");
    const { status, data, error } = useQuery(
        [DASHBOARD_QUERY_KEY, { limit: constants.SECTION_ITEM_LIMIT }],
        getDashboard
    );
    const isLoading = status === "loading";
    const hasErrored = status === "error";

    // TODO: Unify error handling across components, somehow.
    if (hasErrored) {
        console.log(error.message);
    }

    const sections = [
        [
            constants.KIND_ANALYSES,
            constants.SECTION_RECENT,
            t("recentAnalyses"),
            fns.makeID(ids.SECTION_RECENT_ANALYSES),
        ],
        [
            constants.KIND_ANALYSES,
            constants.SECTION_RUNNING,
            t("runningAnalyses"),
            fns.makeID(ids.SECTION_RUNNING_ANALYSES),
        ],
        [
            constants.KIND_APPS,
            constants.SECTION_RECENTLY_ADDED,
            t("recentlyAddedApps"),
            fns.makeID(ids.SECTION_RECENTLY_ADDED_APPS),
        ],
        [
            constants.KIND_APPS,
            constants.SECTION_PUBLIC,
            t("publicApps"),
            fns.makeID(ids.SECTION_PUBLIC_APPS),
        ],
        [
            constants.KIND_FEEDS,
            constants.SECTION_NEWS,
            t("newsFeed"),
            fns.makeID(ids.SECTION_NEWS),
        ],
        [
            constants.KIND_EVENTS,
            constants.SECTION_EVENTS,
            t("eventsFeed"),
            fns.makeID(ids.SECTION_EVENTS),
        ],
    ];

    const filteredSections = data
        ? sections
              .filter(
                  ([kind, section, _label]) =>
                      data.hasOwnProperty(kind) &&
                      data[kind].hasOwnProperty(section)
              )
              .filter(
                  ([kind, section, _label]) => data[kind][section].length > 0
              )
              .map(([kind, section, label, sectionID]) => {
                  return (
                      <DashboardSection
                          id={sectionID}
                          kind={kind}
                          key={`${kind}-${section}`}
                          items={data[kind][section]}
                          name={label}
                          section={section}
                          t={t}
                      />
                  );
              })
        : [];

    let componentContent;

    if (filteredSections.length > 0) {
        componentContent = filteredSections;
    } else {
        componentContent = (
            <Typography color="textSecondary">No content found.</Typography>
        );
    }

    return (
        <div id={fns.makeID(ids.ROOT)} className={classes.gridRoot}>
            {isLoading ? <DashboardSkeleton /> : componentContent}
            <div className={classes.footer} />
        </div>
    );
};

export default Dashboard;
