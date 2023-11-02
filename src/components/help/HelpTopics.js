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

import buildID from "components/utils/DebugIDUtil";

import {
    Grid,
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Button,
    Typography,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import makeStyles from "@mui/styles/makeStyles";
import { useConfig } from "contexts/config";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 350,
        [theme.breakpoints.down("sm")]: {
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
    topics: {
        margin: theme.spacing(1),
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
    const [config] = useConfig();

    const support_email = config?.supportEmail;
    const de_faq = config?.deFaq;

    return (
        <div style={{ overflow: "auto" }}>
            <Typography variant="h6" color="primary" className={classes.topics}>
                {t("support")}
            </Typography>
            <Grid container spacing={3}>
                <Grid item>
                    <TopicCard
                        title={t("faq_title")}
                        description={t("faq_prompt")}
                        action={
                            <Button
                                id={buildID(baseId, ids.FAQ_BTN)}
                                size="small"
                                color="primary"
                                className={classes.action}
                                onClick={() => window.open(de_faq, "_blank")}
                                startIcon={<LaunchIcon />}
                            >
                                {t("faq_button_label")}
                            </Button>
                        }
                    />
                </Grid>
                <Grid item>
                    <TopicCard
                        title={t("contact_title")}
                        description={t("contact_prompt")}
                        action={
                            <>
                                <Button
                                    id={buildID(baseId, ids.EMAIL_BTN)}
                                    color="primary"
                                    href={`mailto:${support_email}`}
                                    startIcon={<LaunchIcon />}
                                    size="small"
                                >
                                    {t("email_button_label")}
                                </Button>
                                <Button
                                    id={buildID(baseId, ids.CHAT_BTN)}
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
                                id={buildID(baseId, ids.FEEDBACK_BTN)}
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

            <Typography variant="h6" color="primary" className={classes.topics}>
                {t("learn")}
            </Typography>
            <Grid container spacing={3}>
                <Grid item>
                    <TopicCard
                        title={t("product_tour_title")}
                        description={t("product_tour_prompt")}
                        action={
                            <Button
                                id={buildID(baseId, ids.TOUR_BTN)}
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
                                id={buildID(baseId, ids.GUIDE_BTN)}
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
                        title={t("glossary_title")}
                        description={t("glossary_prompt")}
                        action={
                            <Button
                                id={buildID(baseId, ids.GLOSSARY_BTN)}
                                color="primary"
                                className={classes.action}
                                startIcon={<LaunchIcon />}
                                size="small"
                                onClick={() =>
                                    window.open(
                                        constants.CYVERSE_GLOSSARY,
                                        "_blank"
                                    )
                                }
                            >
                                {t("glossary_button_label")}
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
                                id={buildID(baseId, ids.LC_BTN)}
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
