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
import { injectIntl } from "react-intl";

import { makeStyles, useTheme } from "@material-ui/styles";
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

import {
    Apps,
    BarChart,
    Event,
    RssFeed,
    OpenInNew,
    OpenInBrowser,
} from "@material-ui/icons";

import { Skeleton } from "@material-ui/lab";

import {
    build as buildID,
    formatDate,
    formatMessage,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import messages from "./messages";
import ids from "./ids";
import * as constants from "./constants";
import {
    getDashboard,
    DASHBOARD_QUERY_KEY,
} from "../../serviceFacades/dashboard";

const makeID = (...names) => buildID(ids.BASE, ...names);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        paddingTop: 0,
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    dividerRoot: {
        marginBottom: theme.spacing(1),
    },
    footer: {
        width: "100%",
        height: 128, // This is needed to get the vertical scrolling to stop cutting off the bottom of the content.

        [theme.breakpoints.down("sm")]: {
            height: 32,
        },
    },
    section: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(5),
    },
    sectionItems: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: 0,
        paddingRight: 0,

        // Try to eek as much space out of the iPhone SE cards as possible.
        [theme.breakpoints.down("sm")]: {
            padding: 0,
            justifyContent: "center",
        },
    },
    subtitle: {
        marginBottom: theme.spacing(2),
    },
    gridRoot: {
        overflow: "auto", // Needed for vertical scrolling.
        height: "90vh", // Needed to get the vertical scrolling working.
        paddingTop: 0,
        paddingLeft: theme.spacing(3),
        paddingBottom: 0,
        paddingRight: theme.spacing(3),

        [theme.breakpoints.down("sm")]: {
            paddingTop: 0,
            paddingLeft: theme.spacing(1),
            paddingBottom: 0,
            paddingRight: theme.spacing(1),
        },
    },
    dashboardCard: {
        height: 225,
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing(2),

        [theme.breakpoints.up("xs")]: {
            width: 300,
            marginRight: theme.spacing(0),
        },

        [theme.breakpoints.up("sm")]: {
            marginRight: theme.spacing(2),
        },

        [theme.breakpoints.up("lg")]: {
            width: 425,
            marginRight: theme.spacing(2),
        },
    },
    actionsRoot: {
        marginLeft: "auto",
    },
    avatar: {
        background: theme.palette.white,
        color: theme.palette.gray,
    },
    cardHeaderDefault: {
        background: theme.palette.primary.main,
        marginBottom: theme.spacing(2),
    },
    cardHeaderDefaultAvatar: {
        color: theme.palette.primary.main,
    },
    cardHeaderEvents: {
        background: theme.palette.violet,
    },
    cardHeaderEventsAvatar: {
        color: theme.palette.violet,
    },
    cardHeaderNews: {
        background: theme.palette.indigo,
    },
    cardHeaderNewsAvatar: {
        color: theme.palette.indigo,
    },
    cardHeaderPublic: {
        background: theme.palette.darkNavy,
    },
    cardHeaderPublicAvatar: {
        color: theme.palette.darkNavy,
    },
    cardHeaderRecent: {
        background: theme.palette.navy,
    },
    cardHeaderRecentAvatar: {
        color: theme.palette.navy,
    },
    cardHeaderRecentlyAdded: {
        background: theme.palette.gold,
    },
    cardHeaderRecentlyAddedAvatar: {
        color: theme.palette.gold,
    },
    cardHeaderText: {
        color: theme.palette.primary.contrastText,
    },
}));

const getOrigination = (kind, content, intl) => {
    let origination;
    let date;

    switch (kind) {
        case constants.KIND_ANALYSES:
            origination = formatMessage(intl, "startedBy");
            date = content.start_date;
            break;
        case constants.KIND_APPS:
            if (content.integration_date) {
                origination = formatMessage(intl, "integratedBy");
                date = content.integration_date;
            } else {
                origination = formatMessage(intl, "editedBy");
                date = content.edited_date;
            }
            break;
        case constants.KIND_FEEDS:
            origination = formatMessage(intl, "publishedBy");
            date = content.date_added;
            break;
        default:
            origination = formatMessage(intl, "by");
    }
    return [
        origination,
        formatDate(date ? new Date(date).valueOf() : new Date().valueOf()),
    ];
};

const getAvatarIcon = (kind, colorClass) => {
    let retval;
    switch (kind) {
        case constants.KIND_ANALYSES:
            retval = (
                <BarChart
                    color="primary"
                    classes={{ colorPrimary: colorClass }}
                />
            );
            break;
        case constants.KIND_APPS:
            retval = (
                <Apps color="primary" classes={{ colorPrimary: colorClass }} />
            );
            break;
        case constants.KIND_FEEDS:
            retval = (
                <RssFeed
                    color="primary"
                    classes={{ colorPrimary: colorClass }}
                />
            );
            break;
        case constants.KIND_EVENTS:
            retval = (
                <Event color="primary" classes={{ colorPrimary: colorClass }} />
            );
            break;
        default:
            retval = (
                <Apps color="primary" classes={{ colorPrimary: colorClass }} />
            );
    }
    return retval;
};

const getSectionClass = (section, classes) => {
    let header;
    let avatar;
    switch (section) {
        case constants.SECTION_EVENTS:
            header = classes.cardHeaderEvents;
            avatar = classes.cardHeaderEventsAvatar;
            break;
        case constants.SECTION_NEWS:
            header = classes.cardHeaderNews;
            avatar = classes.cardHeaderNewsAvatar;
            break;
        case constants.SECTION_PUBLIC:
            header = classes.cardHeaderPublic;
            avatar = classes.cardHeaderPublicAvatar;
            break;
        case constants.SECTION_RECENT:
            header = classes.cardHeaderRecent;
            avatar = classes.cardHeaderRecentAvatar;
            break;
        case constants.SECTION_RECENTLY_ADDED:
            header = classes.cardHeaderRecentlyAdded;
            avatar = classes.cardHeaderRecentlyAddedAvatar;
            break;
        default:
            header = classes.cardHeaderDefault;
            avatar = classes.cardHeaderDefaultAvatar;
            break;
    }
    return [header, avatar];
};

const getLinkIcon = (kind) => {
    let retval;
    switch (kind) {
        case constants.KIND_ANALYSES:
            retval = <OpenInBrowser />;
            break;
        case constants.KIND_APPS:
            retval = <OpenInBrowser />;
            break;
        case constants.KIND_FEEDS:
            retval = <OpenInNew />;
            break;
        case constants.KIND_EVENTS:
            retval = <OpenInNew />;
            break;
        default:
            retval = <OpenInNew />;
    }
    return retval;
};

const getLinkTarget = (kind, content) => {
    let target;
    switch (kind) {
        case constants.KIND_APPS:
            target = `/apps/${content.id}/details`;
            break;
        case constants.KIND_ANALYSES:
            target = `/analyses/${content.id}/details`;
            break;
        default:
            target = content.link;
    }
    return target;
};

const cleanUsername = (username) => {
    let user;
    if (username) {
        if (username.endsWith(constants.USER_SUFFIX)) {
            user = username.replace(constants.USER_SUFFIX, "");
        } else {
            user = username;
        }
    } else {
        user = constants.CYVERSE;
    }
    return user;
};

const cleanField = (field, comparator) => {
    let retval;
    if (field.length > comparator) {
        retval = field.slice(0, comparator) + "...";
    } else {
        retval = field;
    }
    return retval;
};

const cleanDescription = (description) =>
    cleanField(description, constants.DESC_MAX_LENGTH);

const cleanTitle = (title, isLarge = true) => {
    let comparator;

    if (isLarge) {
        comparator = constants.TITLE_MAX_LENGTH;
    } else {
        comparator = constants.TITLE_MAX_LENGTH_SMALL;
    }

    return cleanField(title, comparator);
};

const cleanSubheader = (subheader, isLarge = true) => {
    if (isLarge) {
        return subheader;
    }
    return cleanField(subheader, constants.SUBHEADER_MAX_LENGTH_SMALL);
};

const DashboardLink = ({ kind, content, headerClass }) => {
    const router = useRouter();
    const isNewTab =
        kind === constants.KIND_EVENTS || kind === constants.KIND_FEEDS;
    const target = getLinkTarget(kind, content);
    const icon = getLinkIcon(kind);

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
            {getMessage("open")}
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
            {getMessage("open")}
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

    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up("md"));

    const { kind, content, section, intl } = props;
    const cardID = buildID(kind, content.id);

    const description = cleanDescription(content.description);
    const [origination, date] = getOrigination(kind, content, intl);
    const user = cleanUsername(content.username);
    const [headerClass, avatarClass] = getSectionClass(section, classes);
    const rootClass = clsx(classes.cardHeaderDefault, headerClass);

    return (
        <Card
            className={classes.dashboardCard}
            id={makeID(ids.ITEM, cardID)}
            elevation={4}
        >
            <CardHeader
                avatar={
                    isMediumOrLarger && (
                        <Avatar className={classes.avatar}>
                            {getAvatarIcon(kind, avatarClass)}
                        </Avatar>
                    )
                }
                classes={{ root: rootClass }}
                title={cleanTitle(content.name, isMediumOrLarger)}
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
                        {cleanSubheader(
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
                    {description || getMessage("noDescriptionProvided")}
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

const DashboardSection = ({ name, kind, items, id, section, intl }) => {
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
                        intl={intl}
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

    return <div id={makeID(ids.LOADING)}>{skellies}</div>;
};

const Dashboard = ({ intl }) => {
    const classes = useStyles();
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
            getMessage("recentAnalyses"),
            makeID(ids.SECTION_RECENT_ANALYSES),
        ],
        [
            constants.KIND_ANALYSES,
            constants.SECTION_RUNNING,
            getMessage("runningAnalyses"),
            makeID(ids.SECTION_RUNNING_ANALYSES),
        ],
        [
            constants.KIND_APPS,
            constants.SECTION_RECENTLY_ADDED,
            getMessage("recentlyAddedApps"),
            makeID(ids.SECTION_RECENTLY_ADDED_APPS),
        ],
        [
            constants.KIND_APPS,
            constants.SECTION_PUBLIC,
            getMessage("publicApps"),
            makeID(ids.SECTION_PUBLIC_APPS),
        ],
        [
            constants.KIND_FEEDS,
            constants.SECTION_NEWS,
            getMessage("newsFeed"),
            makeID(ids.SECTION_NEWS),
        ],
        [
            constants.KIND_EVENTS,
            constants.SECTION_EVENTS,
            getMessage("eventsFeed"),
            makeID(ids.SECTION_EVENTS),
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
                          intl={intl}
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
        <div id={makeID(ids.ROOT)} className={classes.gridRoot}>
            {isLoading ? <DashboardSkeleton /> : componentContent}
            <div className={classes.footer} />
        </div>
    );
};

export default withI18N(injectIntl(Dashboard), messages);
