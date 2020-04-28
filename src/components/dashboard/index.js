/**
 * @author johnworth
 *
 * The dashboard component.
 *
 * @module dashboard
 */
import React from "react";
import { useQuery } from "react-query";

import { makeStyles } from "@material-ui/styles";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import {
    build as buildID,
    formatDate,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import messages from "./messages";
import ids from "./ids";
import * as constants from "./constants";
import { getDashboard } from "../../serviceFacades/dashboard";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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
        padding: theme.spacing(2),

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
        width: 450,
        height: 225,
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(1),

        [theme.breakpoints.down("sm")]: {
            width: 300,
        },
    },
    actionsRoot: {
        marginLeft: "auto",
    },
}));

const getOrigination = (kind, content) => {
    let origination;
    let date;

    switch (kind) {
        case constants.KIND_ANALYSES:
            origination = getMessage("startedBy");
            date = content.start_date;
            break;
        case constants.KIND_APPS:
            if (content.integration_date) {
                origination = getMessage("integratedBy");
                date = content.integration_date;
            } else {
                origination = getMessage("editedBy");
                date = content.edited_date;
            }
            break;
        case constants.KIND_FEEDS:
            origination = getMessage("publishedBy");
            date = content.date_added;
            break;
        default:
            origination = getMessage("by");
    }
    return [
        origination,
        formatDate(date ? new Date(date).valueOf() : new Date().valueOf()),
    ];
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

const cleanDescription = (description) => {
    let desc;
    if (description.length > constants.DESC_MAX_LENGTH) {
        desc = description.slice(0, constants.DESC_MAX_LENGTH) + "...";
    } else {
        desc = description;
    }
    return desc;
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
    const { kind, content } = props;
    const cardID = `${kind}-${content.id}`;

    const description = cleanDescription(content.description);
    const [origination, date] = getOrigination(kind, content);
    const user = cleanUsername(content.username);

    return (
        <Card
            className={classes.dashboardCard}
            id={buildID(ids.ITEM_BASE, cardID)}
            elevation={4}
        >
            <CardContent
                classes={{
                    root: classes.root,
                }}
            >
                <Typography noWrap variant="h6" component="h6">
                    {content.name}
                </Typography>

                <Typography
                    classes={{ root: classes.subtitle }}
                    gutterBottom
                    noWrap
                    color="textSecondary"
                >
                    {origination} {`${user} on ${date}`}
                </Typography>

                <Typography color="textSecondary" variant="body2" component="p">
                    {description}
                </Typography>
            </CardContent>

            <CardActions
                classes={{
                    root: classes.actionsRoot,
                }}
            >
                <Button
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                >
                    {getMessage("open")}
                </Button>
            </CardActions>
        </Card>
    );
};

const DashboardSection = ({ name, kind, items }) => {
    const classes = useStyles();

    return (
        <div className={classes.section}>
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
                    <DashboardItem kind={kind} content={item} key={item.id} />
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

    return <div id={buildID(ids.BASE, ids.LOADING)}>{skellies}</div>;
};

const Dashboard = () => {
    const classes = useStyles();
    const { status, data, error } = useQuery(
        ["dashboard", { limit: constants.SECTION_ITEM_LIMIT }],
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
        ],
        [
            constants.KIND_ANALYSES,
            constants.SECTION_RUNNING,
            getMessage("runningAnalyses"),
        ],
        [
            constants.KIND_APPS,
            constants.SECTION_RECENTLY_ADDED,
            getMessage("recentlyAddedApps"),
        ],
        [
            constants.KIND_APPS,
            constants.SECTION_PUBLIC,
            getMessage("publicApps"),
        ],
        [constants.KIND_FEEDS, constants.SECTION_NEWS, getMessage("newsFeed")],
        [
            constants.KIND_FEEDS,
            constants.SECTION_EVENTS,
            getMessage("eventsFeed"),
        ],
    ];

    return (
        <div id={buildID(ids.BASE, ids.ROOT)} className={classes.gridRoot}>
            {isLoading ? (
                <DashboardSkeleton />
            ) : (
                sections
                    .filter(
                        ([kind, section, _label]) =>
                            data[kind] !== undefined &&
                            data[kind][section] !== undefined
                    )
                    .filter(
                        ([kind, section, _label]) =>
                            data[kind][section].length > 0
                    )
                    .map(([kind, section, label]) => {
                        return (
                            <DashboardSection
                                kind={kind}
                                key={`${kind}-${section}`}
                                items={data[kind][section]}
                                name={label}
                            />
                        );
                    })
            )}

            <div className={classes.footer} />
        </div>
    );
};

export default withI18N(Dashboard, messages);
