/**
 *
 * @author sriram
 *
 *
 */
import React, { useState } from "react";
import { useTranslation } from "i18n";

import ids from "./ids";
import constants from "../../constants";
import ProductTour from "components/help/ProductTour";
import Feedback from "components/help/Feedback";
import { intercomShow } from "common/intercom";

import { build } from "@cyverse-de/ui-lib";

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

export default function HelpTopics(props) {
    const { baseId } = props;
    const [runTour, setRunTour] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState();
    const classes = useStyles();
    const { t } = useTranslation("help");
    return (
        <div style={{ overflow: "auto" }}>
            <Typography variant="h6" color="primary">
                {t("support")}
            </Typography>
            <Grid container spacing={3}>
                <Grid item>
                    <TopicCard
                        title={t("faq_title")}
                        description={t("faq_prompt")}
                        action={
                            <Button
                                id={build(baseId, ids.FAQ_BTN)}
                                size="small"
                                color="primary"
                                className={classes.action}
                                onClick={() =>
                                    window.open(constants.DE_FAQ, "_blank")
                                }
                                startIcon={<LaunchIcon />}
                            >
                                {t("faq_button_label")}
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
                                    id={build(baseId, ids.EMAIL_BTN)}
                                    color="primary"
                                    href="mailto:support@ycyverse.org"
                                    startIcon={<LaunchIcon />}
                                    size="small"
                                >
                                    {t("email_button_label")}
                                </Button>
                                <Button
                                    id={build(baseId, ids.CHAT_BTN)}
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
                                    {t("chat_button_label")}
                                </Button>
                            </>
                        }
                    />
                </Grid>
                <Grid item>
                    <TopicCard
                        title={t("feedback_title")}
                        description={t("feedback_prompt")}
                        action={
                            <Button
                                id={build(baseId, ids.FEEDBACK_BTN)}
                                color="primary"
                                onClick={() => setFeedbackOpen(true)}
                                className={classes.action}
                                size="small"
                            >
                                {t("feedback_button_label")}
                            </Button>
                        }
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" color="primary" style={{ marginTop: 16 }}>
                {t("learn")}
            </Typography>
            <Grid container spacing={3}>
                <Grid item>
                    <TopicCard
                        title={t("product_tour_title")}
                        description={t("product_tour_prompt")}
                        action={
                            <Button
                                id={build(baseId, ids.TOUR_BTN)}
                                color="primary"
                                onClick={() => setRunTour(true)}
                                className={classes.action}
                                size="small"
                            >
                                {t("product_tour_button_label")}
                            </Button>
                        }
                    />
                </Grid>
                <Grid item>
                    <TopicCard
                        title={t("guide_title")}
                        description={t("guide_prompt")}
                        action={
                            <Button
                                id={build(baseId, ids.GUIDE_BTN)}
                                color="primary"
                                className={classes.action}
                                startIcon={<LaunchIcon />}
                                size="small"
                                onClick={() =>
                                    window.open(constants.DE_GUIDE, "_blank")
                                }
                            >
                                {t("guide_button_label")}
                            </Button>
                        }
                    />
                </Grid>
                <Grid item>
                    <TopicCard
                        title={t("learning_center_title")}
                        description={t("learning_center_prompt")}
                        action={
                            <Button
                                id={build(baseId, ids.LC_BTN)}
                                color="primary"
                                className={classes.action}
                                startIcon={<LaunchIcon />}
                                size="small"
                                onClick={() =>
                                    window.open(constants.CYVERSE_LC, "_blank")
                                }
                            >
                                {t("learning_center_button_label")}
                            </Button>
                        }
                    />
                </Grid>
            </Grid>
            <Feedback
                open={feedbackOpen}
                title={t("feedback_title")}
                onClose={() => setFeedbackOpen(false)}
            />
            <ProductTour
                onTourExit={() => setRunTour(false)}
                runTour={runTour}
            />
        </div>
    );
}
