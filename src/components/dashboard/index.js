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
        width: 276,
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

    return (
        <Card
            className={classes.dashboardCard}
            id={buildID(ids.ITEM_BASE, cardID)}
        >
            <CardContent>
                <Typography variant="h5" component="h2">
                    {content.name}
                </Typography>
                <Typography variant="body2" component="p">
                    {content.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">{getMessage("More")}</Button>
            </CardActions>
        </Card>
    );
};

const DashboardSection = ({ name, kind, items }) => {
    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <Typography variant="h3" component="h3">
                    {name}
                </Typography>
            </Grid>

            <Grid container item xs={12}>
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

    const getName = (kind, section) => {
        const defaultVal = `${section
            .charAt(0)
            .toUpperString()}${section.splice(1)} ${kind
            .charAt(0)
            .toUpperString()}${kind.splice(1)}`;
        let retval = defaultVal;

        switch (kind) {
            case "apps": {
                switch (section) {
                    case "public":
                        retval = getMessage("publicApps");
                        break;

                    case "recentlyAdded":
                        retval = getMessage("recentlyAddedApps");
                        break;

                    default:
                        break;
                }
                break;
            }

            case "analyses": {
                switch (section) {
                    case "recent":
                        retval = getMessage("recentAnalyses");
                        break;

                    case "running":
                        retval = getMessage("runningAnalyses");
                        break;

                    default:
                        break;
                }
                break;
            }

            default:
                break;
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
        <Grid container className={classes.root} spacing={2}>
            {data
                .keys()
                .map((kind) =>
                    data[kind]
                        .keys()
                        .map((section) => (
                            <DashboardSection
                                kind={kind}
                                items={data[kind]}
                                name={getName(kind, section)}
                            />
                        ))
                )}
        </Grid>
    );
};

export default withI18N(Dashboard, messages);
