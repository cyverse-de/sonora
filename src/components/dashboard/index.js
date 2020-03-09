/**
 * @author johnworth
 *
 * The dashboard component.
 *
 * @module dashboard
 */
import React from "react";

import { makeStyles } from "@material-ui/styles";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from "@material-ui/core";

import { getMessage, withI18N, build as buildID } from "@cyverse-de/ui-lib";

import messages from "./messages";
import ids from "./ids";

const useStyles = makeStyles((theme) => ({
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

const Dashboard = () => {
    return <></>;
};

export default withI18N(Dashboard, messages);
