/**
 * @author johnworth
 *
 * The dashboard component.
 *
 * @module dashboard
 */
import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { useQuery } from "react-query";
import { useTranslation } from "i18n";

import { useTheme } from "@material-ui/styles";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    Avatar,
    useMediaQuery,
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

const DashboardLink = ({ kind, content, headerClass }) => {
    const router = useRouter();
    const { t } = useTranslation("dashboard");
    const isNewTab =
        kind === constants.KIND_EVENTS || kind === constants.KIND_FEEDS;
    const target = fns.getLinkTarget(kind, content);
    const icon = fns.getLinkIcon(kind);

    return isNewTab ? (
        <Button
            href={target}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            size="small"
            startIcon={icon}
            variant="contained"
            classes={{ containedPrimary: headerClass }}
        >
            {t("open")}
        </Button>
    ) : (
        <Button
            color="primary"
            size="small"
            startIcon={icon}
            variant="contained"
            classes={{ containedPrimary: headerClass }}
            onClick={(_) => router.push(target)}
        >
            {t("open")}
        </Button>
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
export const DashboardItem = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation("dashboard");

    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

    const { kind, content, section } = props;
    const cardID = buildID(kind, content.id);

    const description = fns.cleanDescription(content.description);
    const [origination, date] = fns.getOrigination(kind, content);
    const user = fns.cleanUsername(content.username);
    const [headerClass, avatarClass] = fns.getSectionClass(section, classes);
    const rootClass = clsx(classes.cardHeaderDefault, headerClass);

    return (
        <Card
            className={classes.dashboardCard}
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
                classes={{ root: rootClass }}
                title={fns.cleanTitle(content.name, isMediumOrLarger)}
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
                        classes={{ colorTextSecondary: classes.cardHeaderText }}
                    >
                        {fns.cleanSubheader(
                            `${origination} ${user} on ${date}`,
                            isMediumOrLarger
                        )}
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
            >
                <DashboardLink
                    kind={kind}
                    content={content}
                    headerClass={headerClass}
                />
            </CardActions>
        </Card>
    );
};

const DashboardSection = ({ name, kind, items, id, section, t }) => {
    const classes = useStyles();

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

            <div className={classes.sectionItems}>
                {items.map((item) => (
                    <DashboardItem
                        kind={kind}
                        content={item}
                        key={item.id}
                        section={section}
                        t={t}
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
