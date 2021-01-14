/**
 *
 * @author sriram
 *
 *
 */
import React, { useState } from "react";

import ProductTour from "components/help/ProductTour";
import Feedback from "components/help/Feedback";
import { intercomShow } from "common/intercom";
import {
    Grid,
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Button,
    Typography,
} from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 350,
        [theme.breakpoints.down("xs")]: {
            marginLeft: theme.spacing(1),
            width: 275,
            height: 210,
        },
    },
    body: {
        marginTop: theme.spacing(0.1),
    },
    action: {
        marginLeft: "auto",
    },
    title: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
    },
}));

function TopicCard(props) {
    const { title, description, action } = props;
    const classes = useStyles();
    return (
        <Card className={classes.root} variant="outlined">
            <CardHeader
                title={<Typography variant="subtitle2">{title}</Typography>}
                className={classes.title}
            />
            <CardContent>
                <Typography
                    variant="body2"
                    component="p"
                    className={classes.body}
                >
                    {description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>{action}</CardActions>
        </Card>
    );
}

export default function Topics(props) {
    const [runTour, setRunTour] = useState();
    const [feedbackOpen, setFeedbackOpen] = useState();
    const classes = useStyles();
    return (
        <div style={{ overflow: "auto" }}>
            <Typography variant="h6" color="primary">
                Support
            </Typography>
            <Grid container spacing={3}>
                <Grid item>
                    <TopicCard
                        title="FAQs"
                        description="Find answers to some frequently asked questions here."
                        action={
                            <Button
                                size="small"
                                color="primary"
                                className={classes.action}
                                onClick={() =>
                                    window.open(
                                        `http://cyverse.github.io/UserSupport/README.html`,
                                        "_blank"
                                    )
                                }
                                startIcon={<LaunchIcon />}
                            >
                                Go to FAQs
                            </Button>
                        }
                    />
                </Grid>
                <Grid item>
                    <TopicCard
                        title="Contact"
                        description="Contact CyVerse via e-mail or in-app chat."
                        action={
                            <>
                                <Button
                                    color="primary"
                                    href="mailto:support@ycyverse.org"
                                    startIcon={<LaunchIcon />}
                                    size="small"
                                >
                                    E-mail CyVerse
                                </Button>
                                <Button
                                    className={classes.action}
                                    color="primary"
                                    startIcon={<LiveHelpIcon />}
                                    onClick={(event) => {
                                        // prevent form submission
                                        event.preventDefault();
                                        intercomShow();
                                    }}
                                    size="small"
                                >
                                    Chat
                                </Button>
                            </>
                        }
                    />
                </Grid>
                <Grid item>
                    <TopicCard
                        title="Feedback"
                        description="Your thoughts are valuable in helping improve our products."
                        action={
                            <Button
                                color="primary"
                                onClick={() => setFeedbackOpen(true)}
                                className={classes.action}
                                size="small"
                            >
                                Feedback
                            </Button>
                        }
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" color="primary" style={{ marginTop: 16 }}>
                Learn
            </Typography>
            <Grid container spacing={3}>
                <Grid item>
                    <TopicCard
                        title="Product Tour"
                        description="Take a tour to get introduced to the various features of the Discovery Environment."
                        action={
                            <Button
                                color="primary"
                                onClick={() => setRunTour(true)}
                                className={classes.action}
                                size="small"
                            >
                                Take a tour
                            </Button>
                        }
                    />
                </Grid>
                <Grid item>
                    <TopicCard
                        title="Guide"
                        description="Learn more about the Discovery Environment using the platform guide"
                        action={
                            <Button
                                color="primary"
                                className={classes.action}
                                startIcon={<LaunchIcon />}
                                size="small"
                                onClick={() =>
                                    window.open(
                                        `https://learning.cyverse.org/projects/discovery-environment-guide/en/latest/`,
                                        "_blank"
                                    )
                                }
                            >
                                Go to Guide
                            </Button>
                        }
                    />
                </Grid>
                <Grid item>
                    <TopicCard
                        title="Learning Center"
                        description="The CyVerse Learning center is a release of our learning materials in the popular “Read the Docs” formatting."
                        action={
                            <Button
                                color="primary"
                                className={classes.action}
                                startIcon={<LaunchIcon />}
                                size="small"
                                onClick={() =>
                                    window.open(
                                        `https://learning.cyverse.org/en/latest/`,
                                        "_blank"
                                    )
                                }
                            >
                                Go to Learning Center
                            </Button>
                        }
                    />
                </Grid>
            </Grid>
            <Feedback
                open={feedbackOpen}
                title="Feedback"
                baseId="help"
                onClose={() => setFeedbackOpen(false)}
            />
            {runTour && <ProductTour />}
        </div>
    );
}
