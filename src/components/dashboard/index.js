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
    dashboardCard: {
        width: 375,
        height: 200,
        display: "flex",
        flexDirection: "column",
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
                <Button size="small" color="primary">
                    {getMessage("open")}
                </Button>
            </CardActions>
        </Card>
    );
};

const DashboardSection = ({ name, kind, items }) => {
    console.log(items);
    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <Typography gutterBottom variant="h5" component="h5">
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

    const getAppsSectionName = (section, defaultValue) => {
        let retval = defaultValue;
        if (section === "public") {
            retval = getMessage("publicApps");
        } else if (section === "recentlyAdded") {
            retval = getMessage("recentlyAddedApps");
        }
        return retval;
    };

    const getAnalysesSectionName = (section, defaultValue) => {
        let retval = defaultValue;
        if (section === "recent") {
            retval = getMessage("recentAnalyses");
        } else if (section === "running") {
            retval = getMessage("runningAnalyses");
        }
        return retval;
    };

    const getName = (kind, section) => {
        const defaultVal = `${section.charAt(0).toUpperCase()}${section.slice(
            1
        )} ${kind.charAt(0).toUpperCase()}${kind.slice(1)}`;

        let retval = defaultVal;

        if (kind === "apps") {
            retval = getAppsSectionName(section, defaultVal);
        }

        if (kind === "analyses") {
            retval = getAnalysesSectionName(section, defaultVal);
        }

        return retval;
    };

    useEffect(() => {
        callApi({
            endpoint: "/api/dashboard",
        }).then((data) => {
            setData(data);
        });
    }, [setData]);

    return (
        <Grid container className={classes.root} spacing={7}>
            {Object.keys(data).map((kind) =>
                Object.keys(data[kind]).map((section) => (
                    <DashboardSection
                        kind={kind}
                        items={data[kind][section]}
                        name={getName(kind, section)}
                    />
                ))
            )}
        </Grid>
    );
};

export default withI18N(Dashboard, messages);
