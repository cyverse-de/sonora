/**
 * @author johnworth
 *
 * The dashboard component.
 *
 * @module dashboard
 */
import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/styles";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    Typography,
} from "@material-ui/core";

import moment from "moment";

import { getMessage, withI18N, build as buildID } from "@cyverse-de/ui-lib";

import callApi from "../../common/callApi";

import messages from "./messages";
import ids from "./ids";
import * as constants from "./constants";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    dividerRoot: {
        marginBottom: 15,
    },
    subtitle: {
        marginBottom: 15,
    },
    spacing: {
        width: "calc(100% + 56px)", // This is the original setting from MUI itself
        margin: "0px -28px 128px -28px", // This is needed to get the vertical scrolling to stop cutting off the bottom of the content.
    },
    gridRoot: {
        overflow: "auto", // Needed for vertical scrolling.
        height: "100vh", // Needed to get the vertical scrolling working.
        padding: "0 30px 0 30px",
    },
    dashboardCard: {
        width: 450,
        height: 225,
        display: "flex",
        flexDirection: "column",

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
            origination = "Started by";
            date = content.start_date;
            break;
        case constants.KIND_APPS:
            if (content.integration_date) {
                origination = "Integrated by";
                date = content.integration_date;
            } else {
                origination = "Edited by";
                date = content.edited_date;
            }
            break;
        case constants.KIND_FEEDS:
            origination = "Published by";
            date = content.date_added;
            break;
        default:
            origination = "By";
            date = moment();
    }

    date = moment(date).format("MMMM Do YYYY, h:mm:ss a");

    return [origination, date];
};

const cleanUsername = (username) => {
    let user;
    if (username) {
        if (username.endsWith("@iplantcollaborative.org")) {
            user = username.replace("@iplantcollaborative.org", "");
        } else {
            user = username;
        }
    } else {
        user = "CyVerse";
    }
    return user;
};

const cleanDescription = (description) => {
    let desc;
    if (description.length > 140) {
        desc = description.slice(0, 140) + "...";
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
                    {`${origination} ${user} on ${date}`}
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
        <Grid container item xs={12}>
            <Grid item xs={12}>
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
            </Grid>

            <Grid container item xs={12} spacing={1}>
                {items.map((item) => (
                    <Grid item key={item.id}>
                        <DashboardItem kind={kind} content={item} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

const Dashboard = () => {
    const classes = useStyles();
    const [data, setData] = useState({});

    useEffect(() => {
        callApi({
            endpoint: "/api/dashboard",
        }).then((data) => {
            setData(data);
        });
    }, []);

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
        <div className={classes.gridRoot}>
            <Grid
                container
                item
                classes={{
                    root: classes.root,
                    "spacing-xs-7": classes.spacing,
                }}
                spacing={7}
            >
                {sections
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
                    })}
            </Grid>
        </div>
    );
};

export default withI18N(Dashboard, messages);
