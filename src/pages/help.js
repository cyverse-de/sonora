/**
 *
 * @author sriram
 *
 * A page to access the DE Help center.
 *
 */

import React, { useState } from "react";

import { Button, Divider, Link, Typography } from "@material-ui/core";
import ProductTour from "components/help/ProductTour";
import Feedback from "components/help/Feedback";

export default function Help() {
    const [runTour, setRunTour] = useState();
    const [feedbackOpen, setFeedbackOpen] = useState();
    return (
        <>
            <Typography variant="h6" color="primary">
                Help Center
            </Typography>
            <Divider />
            <Typography
                variant="subtitle2"
                color="primary"
                style={{ marginTop: 16 }}
            >
                Product Tour
            </Typography>
            <Typography>
                Take a tour to get introduced to the various features of the
                Discovery Environment.
            </Typography>
            <Button
                onClick={() => setRunTour(true)}
                variant="outlined"
                color="primary"
            >
                Start Tour
            </Button>
            <Typography
                variant="subtitle2"
                color="primary"
                style={{ marginTop: 16 }}
            >
                FAQs
            </Typography>
            <Typography>
                Get answers to some frequently asked questions here.{" "}
                <Link href="http://cyverse.github.io/UserSupport/README.html">
                    Go to FAQs
                </Link>
            </Typography>
            <Typography
                variant="subtitle2"
                color="primary"
                style={{ marginTop: 16 }}
            >
                Guide
            </Typography>
            <Typography>
                Learn more about the Discovery Environment using the{" "}
                <Link href="https://learning.cyverse.org/projects/discovery-environment-guide/en/latest/">
                    platform guide.
                </Link>
            </Typography>
            <Typography
                variant="subtitle2"
                color="primary"
                style={{ marginTop: 16 }}
            >
                Learning
            </Typography>
            <Typography>
                The CyVerse{" "}
                <Link href="https://learning.cyverse.org/en/latest/">
                    Learning center
                </Link>{" "}
                is a release of our learning materials in the popular “Read the
                Docs” formatting.
            </Typography>
            <Typography
                variant="subtitle2"
                color="primary"
                style={{ marginTop: 16 }}
            >
                Feedback
            </Typography>
            <Typography>
                Your thoughts are valuable in helping improve our products.
            </Typography>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setFeedbackOpen(true)}
            >
                Give Feedback
            </Button>
            <Typography
                variant="subtitle2"
                color="primary"
                style={{ marginTop: 16 }}
            >
                Contact Support
            </Typography>
            <Typography>
                You may contact CyVerse via e-mail to{" "}
                <Link href="mailto:support@ycyverse.org">support.</Link>
            </Typography>
            <Feedback
                open={feedbackOpen}
                title="Feedback"
                baseId="help"
                onClose={() => setFeedbackOpen(false)}
            />
            {runTour && <ProductTour />}
        </>
    );
}
