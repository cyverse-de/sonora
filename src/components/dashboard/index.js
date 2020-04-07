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
    Grid,
    Typography,
} from "@material-ui/core";

import { getMessage, withI18N, build as buildID } from "@cyverse-de/ui-lib";

import callApi from "../../common/callApi";

import messages from "./messages";
import ids from "./ids";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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
        width: 375,
        height: 200,
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

    let description = content.description;
    if (description.length > 140) {
        description = description.slice(0, 140) + "...";
    }

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
                <Typography noWrap gutterBottom variant="h6" component="h6">
                    {content.name}
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
    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <Typography noWrap gutterBottom variant="h5" component="h5">
                    {name}
                </Typography>
            </Grid>

            <Grid container item xs={12} spacing={2}>
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
        ["analyses", "recent", getMessage("recentAnalyses")],
        ["analyses", "running", getMessage("runningAnalyses")],
        ["apps", "recentlyAdded", getMessage("recentlyAddedApps")],
        ["apps", "public", getMessage("publicApps")],
        ["feeds", "news", getMessage("newsFeed")],
        ["feeds", "events", getMessage("eventsFeed")],
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
